const asyncHandler = require("express-async-handler");
const { initializeGemini, getGeminiModel } = require("../config/geminiConfig");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const AI_EMAIL = "ai-assistant@howsgoing.com";
const AI_NAME = "AI Assistant";

const getAiUser = async () => {
  let aiUser = await User.findOne({ email: AI_EMAIL });

  if (!aiUser) {
    aiUser = await User.create({
      name: AI_NAME,
      email: AI_EMAIL,
      password: process.env.AI_ASSISTANT_PASSWORD || "AI@123456",
      pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNKpHc1qx4l7Pr4THNK3LZD97vLGIRrsPdUQ&s",
    });
  }

  return aiUser;
};

// Get AI Assistant chat (separate AI chat)
const getOrCreateAIChat = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const aiUser = await getAiUser();

    let aiChat = await Chat.findOne({
      users: { $all: [userId, aiUser._id] },
      isAIChat: true,
    }).populate("users", "-password");

    if (!aiChat) {
      aiChat = await Chat.create({
        chatName: "HG AI",
        isGroupChat: false,
        isAIChat: true,
        users: [userId, aiUser._id],
      });
      aiChat = await aiChat.populate("users", "-password");
    }

    res.status(200).json(aiChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Send message to AI
const sendAIMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  const userId = req.user._id;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Content and chatId are required" });
  }

  try {
    const aiUser = await getAiUser();

    let message = await Message.create({
      sender: userId,
      content,
      chat: chatId,
    });

    message = await message.populate("sender", "name pic email");
    message = await message.populate({
      path: "chat",
      populate: { path: "users", select: "name pic email" },
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    const client = initializeGemini();
    const model = getGeminiModel(client);
    const result = await model.generateContent(content);
    const aiResponse = result.response.text();

    let aiMessage = await Message.create({
      sender: aiUser._id,
      content: aiResponse,
      chat: chatId,
    });

    aiMessage = await aiMessage.populate("sender", "name pic email");
    aiMessage = await aiMessage.populate({
      path: "chat",
      populate: { path: "users", select: "name pic email" },
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: aiMessage });

    res.status(201).json({
      userMessage: message,
      aiMessage,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Summarize messages
const summarizeMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: "chatId is required" });
  }

  try {
    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("sender", "name")
      .lean();

    const messageHistory = messages
      .reverse()
      .map((msg) => `${msg.sender.name}: ${msg.content}`)
      .join("\n");

    const summaryPrompt = `Please summarize the following conversation concisely:\n\n${messageHistory}`;
    const client = initializeGemini();
    const model = getGeminiModel(client);
    const result = await model.generateContent(summaryPrompt);
    const summary = result.response.text();

    res.status(200).json({ summary });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate response for group chat mention
const generateAIResponse = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const client = initializeGemini();
    const model = getGeminiModel(client);
    const result = await model.generateContent(content);
    const aiResponse = result.response.text();

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  getOrCreateAIChat,
  sendAIMessage,
  summarizeMessages,
  generateAIResponse,
};
