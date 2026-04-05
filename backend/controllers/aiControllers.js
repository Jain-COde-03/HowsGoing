const asyncHandler = require("express-async-handler");
const { initializeGemini, getGeminiModel } = require("../config/geminiConfig");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const AI_EMAIL = "ai-assistant@howsgoing.com";
const AI_NAME = "HG AI";

let cachedAIUser = null;

// 🔹 Get or cache AI user
const getAiUser = async () => {
  if (cachedAIUser) return cachedAIUser;

  let aiUser = await User.findOne({ email: AI_EMAIL });

  if (!aiUser) {
    aiUser = await User.create({
      name: AI_NAME,
      email: AI_EMAIL,
      password: process.env.AI_ASSISTANT_PASSWORD || "AI@123456",
      pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNKpHc1qx4l7Pr4THNK3LZD97vLGIRrsPdUQ&s",
    });
  }

  cachedAIUser = aiUser;
  return aiUser;
};

// 🔹 Get or Create AI Chat
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

// 🔹 Send message to AI (with context)
const sendAIMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  const userId = req.user._id;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Content and chatId are required" });
  }

  try {
    const aiUser = await getAiUser();

    // Save user message
    let message = await Message.create({
      sender: userId,
      content,
      chat: chatId,
    });

    message = await message.populate("sender", "name pic email");

    // 🔹 Fetch last 10 messages for context
    const previousMessages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 })
      .limit(10)
      .populate("sender", "name");

    const history = previousMessages
      .map((msg) => `${msg.sender.name}: ${msg.content}`)
      .join("\n");

    // 🔹 Better prompt
    const prompt = `
You are HG AI, a smart and friendly assistant in a chat application.

Rules:
- Keep responses concise
- Be helpful and accurate
- Use simple language
- If unsure, say "I'm not sure"

Conversation:
${history}

User: ${content}
AI:
`;

    const client = initializeGemini();
    const model = getGeminiModel(client);

    const result = await model.generateContent(prompt);
    const aiResponse = result?.response?.text() || "Sorry, I couldn't respond.";

    // Save AI message
    let aiMessage = await Message.create({
      sender: aiUser._id,
      content: aiResponse,
      chat: chatId,
    });

    aiMessage = await aiMessage.populate("sender", "name pic email");

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: aiMessage,
    });

    res.status(201).json({
      userMessage: message,
      aiMessage,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Summarize messages
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

// 🔹 Group chat AI response
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
Reply only if the message is meaningful.

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
