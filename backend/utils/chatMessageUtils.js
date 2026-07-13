const Message = require("../models/messageModel");

const syncLegacyMessages = async (chat) => {
  const legacyMessages = await Message.find({ chat: chat._id })
    .sort({ createdAt: 1 })
    .lean();

  if (!legacyMessages.length) {
    return chat;
  }

  const existingIds = new Set(
    (chat.messages || []).map((message) => String(message._id)),
  );

  let hasChanges = false;

  legacyMessages.forEach((message) => {
    if (existingIds.has(String(message._id))) {
      return;
    }

    chat.messages.push({
      _id: message._id,
      sender: message.sender,
      content: message.content,
      chat: message.chat,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    });
    hasChanges = true;
  });

  if (hasChanges) {
    chat.messages.sort(
      (left, right) => new Date(left.createdAt) - new Date(right.createdAt),
    );
    chat.latestMessage = chat.messages[chat.messages.length - 1] || null;
    await chat.save();
  }

  return chat;
};

module.exports = { syncLegacyMessages };
