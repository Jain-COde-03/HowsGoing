/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Lottie from "react-lottie";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../Config/ChatLogics";
import ProfileModel from "./Miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import GroupProfileModel from "./Miscellaneous/GroupProfileModel";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_ENDPOINT || "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("../Animations/typing.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config,
      );
      console.log("Fetched messages:", data);
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
      console.log("Socket connected");
    });

    socket.on("typing", (userId) => {
      if (userId !== user._id) {
        setIsTyping(true);
      }
    });
    socket.on("stop typing", (userId) => {
      if (userId !== user._id) {
        setIsTyping(false);
      }
    });

    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          setNotifications([newMessageRecieved, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id, user._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config,
        );
        console.log("Message sent:", data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id, user._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id, user._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Box
                  fontFamily="Work sans"
                  fontSize="2xl"
                  display="flex"
                  alignItems="center"
                  gap={3}
                >
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    name={getSender(user, selectedChat.users)}
                    src={
                      selectedChat.users[0]._id === user._id
                        ? selectedChat.users[1].pic
                        : selectedChat.users[0].pic
                    }
                  />
                  {getSender(user, selectedChat.users)}
                </Box>
                <ProfileModel
                  user={
                    selectedChat.users[0]._id === user._id
                      ? selectedChat.users[1]
                      : selectedChat.users[0]
                  }
                />
              </>
            ) : (
              <Box
                fontFamily="Work sans"
                fontSize="2xl"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="100%"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="start"
                  gap={3}
                  w="50%"
                >
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    name={selectedChat.chatName}
                  />
                  {selectedChat.chatName.toUpperCase()}
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={3}
                  justifyContent="end"
                  w="50%"
                >
                  {
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                    />
                  }
                  {<GroupProfileModel />}
                </Box>
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <>
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                  height: "100%",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={(e) => sendMessage(e)} isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    height={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : null}
              <Input
                variant="filled"
                bg="#d3d0d0"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={(e) => typingHandler(e)}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100%"
          h="100%"
          minH="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;
