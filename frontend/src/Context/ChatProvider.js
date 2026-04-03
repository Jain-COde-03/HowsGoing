import React, { useContext, useState, useEffect } from "react";
import { createContext } from "react";
import { useHistory } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setuser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    setuser(userInfo);

    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  return (
    <div>
      <ChatContext.Provider
        value={{
          user,
          setuser,
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
