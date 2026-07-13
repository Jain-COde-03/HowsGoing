const normalizeUsers = (users) => (Array.isArray(users) ? users : []);

const getSenderFull = (loggedUser, users) => {
  const normalizedUsers = normalizeUsers(users);

  if (!loggedUser?._id || normalizedUsers.length === 0) {
    return normalizedUsers[0] || null;
  }

  return (
    normalizedUsers.find((user) => user?._id !== loggedUser._id) ||
    normalizedUsers[0] ||
    null
  );
};

const getSender = (loggedUser, users) => {
  return getSenderFull(loggedUser, users)?.name || "Unknown User";
};

const getSenderGroup = (loggedUser, users) => {
  return normalizeUsers(users).filter((u) => u?._id !== loggedUser?._id);
};

const getSenderGroupFull = (loggedUser, users) => {
  return getSenderGroup(loggedUser, users);
};

const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

module.exports = {
  getSender,
  getSenderFull,
  getSenderGroup,
  getSenderGroupFull,
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
};
