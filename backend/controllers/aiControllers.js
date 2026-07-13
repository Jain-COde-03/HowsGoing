const asyncHandler = require("express-async-handler");
const { initializeGemini, getGeminiModel } = require("../config/geminiConfig");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { syncLegacyMessages } = require("../utils/chatMessageUtils");

const AI_EMAIL = "ai-assistant@howsgoing.com";
const AI_NAME = "HG AI";

let cachedAIUser = null;

const buildChatPayload = (chat) => ({
  _id: chat._id,
  chatName: chat.chatName,
  isGroupChat: chat.isGroupChat,
  isAIChat: chat.isAIChat,
  users: chat.users,
});

const getAiUser = async () => {
  if (cachedAIUser) return cachedAIUser;

  let aiUser = await User.findOne({ email: AI_EMAIL });

  if (!aiUser) {
    aiUser = await User.create({
      name: AI_NAME,
      email: AI_EMAIL,
      password: process.env.AI_ASSISTANT_PASSWORD || "AI@123456",
      pic: "https://res.cloudinary.com/dzqiwkcet/image/upload/v1775640653/cute-smiling-robot-avatar-icon-blue-circle-flat-vector-illustration-futuristic-chatbot_319667-729_jmqjgp.jpg",
    });
  }

  cachedAIUser = aiUser;
  return aiUser;
};

const getOrCreateAIChat = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const aiUser = await getAiUser();

    let aiChat = await Chat.findOne({
      users: { $all: [userId, aiUser._id] },
      isAIChat: true,
    })
      .populate("users", "-password")
      .populate("latestMessage.sender", "name pic email");

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

const sendAIMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  const userId = req.user._id;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Content and chatId are required" });
  }

  try {
    const aiUser = await getAiUser();
    const chat = await Chat.findById(chatId).populate(
      "users",
      "name pic email",
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await syncLegacyMessages(chat);

    chat.messages.push({
      sender: userId,
      content,
      chat: chatId,
    });

    await chat.populate("messages.sender", "name pic email");
    const previousMessages = chat.messages.slice(-10);

    const history = previousMessages
      .map((msg) => `${msg.sender.name}: ${msg.content}`)
      .join("\n");

    const prompt = `
You are HG AI, a smart and friendly assistant in a chat application.
Give response in ver detailed way .
Conversation:
${history}

User: ${content}
AI:
`;

    const client = initializeGemini();
    const model = getGeminiModel(client);

    const result = await model.generateContent(prompt);
    const aiResponse = result?.response?.text() || "Sorry, I couldn't respond.";

    chat.messages.push({
      sender: aiUser._id,
      content: aiResponse,
      chat: chatId,
    });

    chat.latestMessage = chat.messages[chat.messages.length - 1];
    await chat.save();

    await chat.populate("messages.sender", "name pic email");
    await chat.populate("latestMessage.sender", "name pic email");

    const userMessage = chat.messages[chat.messages.length - 2].toObject();
    const aiMessage = chat.messages[chat.messages.length - 1].toObject();
    const chatPayload = buildChatPayload(chat);

    userMessage.chat = chatPayload;
    aiMessage.chat = chatPayload;

    res.status(201).json({
      userMessage,
      aiMessage,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const summarizeMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: "chatId is required" });
  }

  try {
    const chat = await Chat.findById(chatId).populate(
      "messages.sender",
      "name",
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await syncLegacyMessages(chat);
    await chat.populate("messages.sender", "name");

    const messages = chat.messages.slice(-20);

    const messageHistory = messages
      .map((msg) => `${msg.sender.name}: ${msg.content}`)
      .join("\n");

    const prompt = `
Summarize this conversation in a short and clear way:

${messageHistory}
`;

    const client = initializeGemini();
    const model = getGeminiModel(client);

    const result = await model.generateContent(prompt);
    const summary = result?.response?.text() || "Could not generate summary.";

    res.status(200).json({ summary });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const generateAIResponse = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const client = initializeGemini();
    const model = getGeminiModel(client);

    const prompt = `
You are HG AI inside a group chat.

Message:
${content}
`;

    const result = await model.generateContent(prompt);
    const aiResponse = result?.response?.text() || "No response generated.";

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
