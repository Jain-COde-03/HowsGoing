import React, { useContext, useState, useEffect } from "react";
import { createContext } from "react";
import { useHistory } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
<<<<<<< HEAD
  const [user, setuser] = useState();
=======
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const history = useHistory();
<<<<<<< HEAD
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    setuser(userInfo);

    if (!userInfo) {
      history.push("/");
    }
  }, [history]);
=======

  useEffect(() => {
    if (!user) {
      history.push("/");
    }
  }, [history, user]);
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)

  return (
    <div>
      <ChatContext.Provider
        value={{
          user,
<<<<<<< HEAD
          setuser,
=======
          setUser,
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)
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
