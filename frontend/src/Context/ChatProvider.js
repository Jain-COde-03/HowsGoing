import React, { useContext, useState, useEffect } from "react";
import { createContext } from "react";
import { useHistory } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push("/");
    }
  }, [history, user]);

  return (
    <div>
      <ChatContext.Provider
        value={{
          user,
          setUser,
          selectedChat,
          setSelectedChat,
          chats,
          setChats,
          notifications,
          setNotifications,
        }}
      >
        {children}
      </ChatContext.Provider>
    </div>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
