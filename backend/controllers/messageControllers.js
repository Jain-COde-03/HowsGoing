const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const { syncLegacyMessages } = require("../utils/chatMessageUtils");

const buildChatPayload = (chat) => ({
  _id: chat._id,
  chatName: chat.chatName,
  isGroupChat: chat.isGroupChat,
  isAIChat: chat.isAIChat,
  users: chat.users,
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    const chat = await Chat.findById(chatId).populate("users", "name pic email");

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    await syncLegacyMessages(chat);

    chat.messages.push({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    chat.latestMessage = chat.messages[chat.messages.length - 1];
    await chat.save();

    await chat.populate("messages.sender", "name pic email");
    await chat.populate("latestMessage.sender", "name pic email");

    const message = chat.messages[chat.messages.length - 1].toObject();
    message.chat = buildChatPayload(chat);

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("users", "name pic email")
      .populate("messages.sender", "name pic email");

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    await syncLegacyMessages(chat);
    await chat.populate("messages.sender", "name pic email");

    const messages = chat.messages.map((message) => {
      const formattedMessage = message.toObject();
      formattedMessage.chat = buildChatPayload(chat);
      return formattedMessage;
    });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
