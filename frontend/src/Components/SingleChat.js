/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Avatar,
  Box,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
} from "@chakra-ui/icons";
import {
  IoSend,
  IoHappyOutline,
  IoAttachOutline,
  IoSearchOutline,
  IoClose,
  IoShieldCheckmark,
} from "react-icons/io5";
import {
  BsThreeDotsVertical,
  BsRobot,
  BsFillCircleFill,
  BsPersonCheckFill,
} from "react-icons/bs";
import { FaWhatsapp, FaRobot, FaUsers, FaLock } from "react-icons/fa";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModel from "./Miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import GroupProfileModel from "./Miscellaneous/GroupProfileModel";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://howsgoing.onrender.com"
    : "http://localhost:5001";

var socket;
var selectedChatCompare;

const QUICK_EMOJIS = ["😀", "😂", "😍", "👍", "❤️", "🎉", "🔥", "🙏", "🤖", "🚀"];

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showInChatSearch, setShowInChatSearch] = useState(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState("");

  const toast = useToast();
  const directChatUser = getSenderFull(user, selectedChat?.users);
  const inputRef = useRef(null);

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
      setMessages(data);
      socket?.emit("join chat", selectedChat._id);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Loading Messages",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    setShowInChatSearch(false);
    setInChatSearchQuery("");
  }, [selectedChat]);

  useEffect(() => {
    if (!user) return;

    if (!socket) {
      socket = io(ENDPOINT, {
        transports: ["websocket", "polling"],
        upgrade: false,
      });
    }

    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
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
        setNotifications((prev) => {
          if (prev.some((n) => n._id === newMessageRecieved._id)) return prev;
          return [newMessageRecieved, ...prev];
        });
        setFetchAgain((prev) => !prev);
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    });

    return () => {
      if (!socket) return;
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.off("message recieved");
    };
  }, [user, setFetchAgain, setNotifications]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    socket?.emit("stop typing", selectedChat._id, user._id);
    const messageToSend = newMessage;
    setNewMessage("");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const endpoint = selectedChat.isAIChat
        ? "/api/ai/message"
        : "/api/message";
      const body = { content: messageToSend, chatId: selectedChat._id };

      const { data } = await axios.post(endpoint, body, config);

      if (selectedChat.isAIChat) {
        socket?.emit("new message", data.userMessage);
        socket?.emit("new message", data.aiMessage);
        setMessages((prev) => [...prev, data.userMessage, data.aiMessage]);
      } else {
        socket?.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      }
      setFetchAgain((prev) => !prev);
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id, user._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id, user._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  // Messages filtered by in-chat search query if active
  const displayedMessages = inChatSearchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(inChatSearchQuery.toLowerCase())
      )
    : messages;

  // Format group members summary
  const getGroupMembersSummary = () => {
    if (!selectedChat?.users) return "";
    return selectedChat.users.map((u) => (u._id === user._id ? "You" : u.name)).join(", ");
  };

  return (
    <Box display="flex" flexDirection="column" h="100%" w="100%">
      {selectedChat ? (
        <>
          {/* 1. WhatsApp Chat Top Header Bar */}
          <Flex
            bg="#f0f2f5"
            px={{ base: 2, md: 4 }}
            py={2.5}
            h="60px"
            align="center"
            justify="space-between"
            borderBottom="1px solid"
            borderColor="#e9edef"
            zIndex="2"
          >
            {/* Left: Back button (mobile) + Avatar + Chat Details */}
            <Flex align="center" gap={3} minW="0" flex="1">
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon fontSize="20px" />}
                onClick={() => setSelectedChat("")}
                variant="ghost"
                size="sm"
                aria-label="Back"
                borderRadius="full"
              />

              {/* Avatar */}
              {!selectedChat.isGroupChat && !selectedChat.isAIChat ? (
                <ProfileModel user={directChatUser || {}}>
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    name={getSender(user, selectedChat.users)}
                    src={directChatUser?.pic}
                    bg="#00a884"
                    color="white"
                  />
                </ProfileModel>
              ) : selectedChat.isAIChat ? (
                <Avatar
                  size="sm"
                  name="AI Assistant"
                  src="robot.png"
                  bg="#4338ca"
                  color="white"
                />
              ) : (
                <GroupProfileModel>
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    name={selectedChat.chatName}
                    bg="#008069"
                    color="white"
                  />
                </GroupProfileModel>
              )}

              {/* Title & Status info */}
              <Box minW="0" flex="1">
                <Text
                  fontSize="16px"
                  fontWeight="600"
                  color="#111b21"
                  noOfLines={1}
                >
                  {selectedChat.isAIChat
                    ? "Gemini AI Assistant"
                    : !selectedChat.isGroupChat
                      ? getSender(user, selectedChat.users)
                      : selectedChat.chatName}
                </Text>
                <Text
                  fontSize="12px"
                  color={istyping ? "#00a884" : "#667781"}
                  fontWeight={istyping ? "600" : "400"}
                  noOfLines={1}
                >
                  {istyping ? (
                    "typing..."
                  ) : selectedChat.isAIChat ? (
                    "Online • Gemini AI"
                  ) : selectedChat.isGroupChat ? (
                    getGroupMembersSummary()
                  ) : (
                    "Online"
                  )}
                </Text>
              </Box>
            </Flex>

            {/* Right: Actions */}
            <Flex align="center" gap={1}>
              {/* In-chat search toggle */}
              <Tooltip label="Search in chat" hasArrow placement="bottom">
                <IconButton
                  size="sm"
                  variant="ghost"
                  borderRadius="full"
                  icon={<Icon as={IoSearchOutline} fontSize="18px" color="#54656f" />}
                  _hover={{ bg: "#e9edef" }}
                  aria-label="Search"
                  onClick={() => setShowInChatSearch(!showInChatSearch)}
                />
              </Tooltip>

              {/* Group Settings if group */}
              {selectedChat.isGroupChat && (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              )}

              {/* Profile or Group info trigger */}
              {!selectedChat.isGroupChat && !selectedChat.isAIChat && (
                <ProfileModel user={directChatUser || {}}>
                  <Tooltip label="Contact info" hasArrow placement="bottom">
                    <IconButton
                      size="sm"
                      variant="ghost"
                      borderRadius="full"
                      icon={<Icon as={BsPersonCheckFill} fontSize="17px" color="#54656f" />}
                      _hover={{ bg: "#e9edef" }}
                      aria-label="Contact info"
                    />
                  </Tooltip>
                </ProfileModel>
              )}

              {/* 3-dots Menu */}
              <Menu>
                <MenuButton
                  as={IconButton}
                  size="sm"
                  variant="ghost"
                  icon={<Icon as={BsThreeDotsVertical} fontSize="16px" color="#54656f" />}
                  borderRadius="full"
                  _hover={{ bg: "#e9edef" }}
                  aria-label="More options"
                />
                <MenuList
                  boxShadow="0 4px 12px rgba(11,20,26,0.15)"
                  border="1px solid #e9edef"
                  borderRadius="8px"
                  p={1}
                  zIndex={10}
                >
                  {selectedChat.isGroupChat ? (
                    <GroupProfileModel>
                      <MenuItem fontSize="sm" _hover={{ bg: "#f5f6f6" }} borderRadius="6px">
                        Group info
                      </MenuItem>
                    </GroupProfileModel>
                  ) : (
                    <ProfileModel user={directChatUser || {}}>
                      <MenuItem fontSize="sm" _hover={{ bg: "#f5f6f6" }} borderRadius="6px">
                        Contact info
                      </MenuItem>
                    </ProfileModel>
                  )}
                  <MenuItem
                    fontSize="sm"
                    onClick={() => setSelectedChat("")}
                    _hover={{ bg: "#f5f6f6" }}
                    borderRadius="6px"
                  >
                    Close chat
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          {/* In-chat search bar (collapsible) */}
          {showInChatSearch && (
            <Flex
              bg="#f0f2f5"
              px={4}
              py={2}
              align="center"
              gap={2}
              borderBottom="1px solid #e9edef"
            >
              <InputGroup size="sm">
                <Input
                  value={inChatSearchQuery}
                  onChange={(e) => setInChatSearchQuery(e.target.value)}
                  placeholder="Search in this chat..."
                  bg="white"
                  borderRadius="8px"
                  fontSize="13px"
                />
                {inChatSearchQuery && (
                  <InputRightElement>
                    <IconButton
                      size="xs"
                      variant="ghost"
                      icon={<Icon as={IoClose} />}
                      onClick={() => setInChatSearchQuery("")}
                      aria-label="Clear"
                    />
                  </InputRightElement>
                )}
              </InputGroup>
              <IconButton
                size="sm"
                variant="ghost"
                icon={<Icon as={IoClose} />}
                onClick={() => {
                  setShowInChatSearch(false);
                  setInChatSearchQuery("");
                }}
                aria-label="Close search"
              />
            </Flex>
          )}

          {/* 2. Message History Container with WhatsApp Wallpaper Background */}
          <Box
            flex="1"
            className="whatsapp-chat-bg"
            overflowY="auto"
            position="relative"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            {loading ? (
              <Flex justify="center" align="center" flex="1">
                <Spinner
                  size="xl"
                  w={12}
                  h={12}
                  thickness="3px"
                  color="#00a884"
                  emptyColor="#e9edef"
                />
              </Flex>
            ) : (
              <Box flex="1" overflowY="auto">
                <ScrollableChat
                  messages={displayedMessages}
                  isGroupChat={selectedChat.isGroupChat}
                  isAIChat={selectedChat.isAIChat}
                />
              </Box>
            )}

            {/* Typing indicator bubble */}
            {istyping && (
              <Box px={5} pb={2}>
                <Flex
                  align="center"
                  gap={2}
                  bg="white"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  boxShadow="0 1px 0.5px rgba(11,20,26,0.13)"
                  w="fit-content"
                >
                  <Spinner size="xs" color="#00a884" />
                  <Text fontSize="12px" color="#008069" fontWeight="600">
                    typing...
                  </Text>
                </Flex>
              </Box>
            )}
          </Box>

          {/* Quick Emoji Bar (Toggled on/off) */}
          {showEmojiPicker && (
            <Flex
              bg="#f0f2f5"
              px={4}
              py={2}
              gap={3}
              borderTop="1px solid #e9edef"
              overflowX="auto"
            >
              {QUICK_EMOJIS.map((emoji) => (
                <Text
                  key={emoji}
                  fontSize="22px"
                  cursor="pointer"
                  _hover={{ transform: "scale(1.25)" }}
                  transition="transform 0.1s"
                  onClick={() => addEmoji(emoji)}
                >
                  {emoji}
                </Text>
              ))}
            </Flex>
          )}

          {/* 3. WhatsApp Message Input Bottom Bar */}
          <Flex
            bg="#f0f2f5"
            px={{ base: 2, md: 4 }}
            py={2}
            align="center"
            gap={2}
            borderTop="1px solid"
            borderColor="#e9edef"
          >
            {/* Emoji Toggle */}
            <Tooltip label="Emojis" hasArrow placement="top">
              <IconButton
                size="sm"
                variant="ghost"
                borderRadius="full"
                icon={<Icon as={IoHappyOutline} fontSize="22px" color="#54656f" />}
                _hover={{ bg: "#e9edef", color: "#111b21" }}
                aria-label="Emoji"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
            </Tooltip>

            {/* Attach Icon */}
            <Tooltip label="Attach" hasArrow placement="top">
              <IconButton
                size="sm"
                variant="ghost"
                borderRadius="full"
                icon={<Icon as={IoAttachOutline} fontSize="22px" color="#54656f" />}
                _hover={{ bg: "#e9edef", color: "#111b21" }}
                aria-label="Attach"
                onClick={() => {
                  toast({
                    title: "Attachments",
                    description: "Image & file sharing coming soon!",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                  });
                }}
              />
            </Tooltip>

            {/* Input Field */}
            <FormControl flex="1" isRequired>
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message"
                bg="white"
                border="none"
                borderRadius="8px"
                h="42px"
                fontSize="15px"
                color="#111b21"
                _placeholder={{ color: "#8696a0", fontSize: "15px" }}
                _focus={{
                  bg: "white",
                  boxShadow: "0 0 0 1px #00a884",
                }}
              />
            </FormControl>

            {/* WhatsApp Send Button */}
            <IconButton
              size="md"
              bg={newMessage.trim() ? "#00a884" : "transparent"}
              color={newMessage.trim() ? "white" : "#54656f"}
              borderRadius="full"
              _hover={{
                bg: newMessage.trim() ? "#008069" : "#e9edef",
              }}
              icon={<Icon as={IoSend} fontSize="17px" />}
              aria-label="Send message"
              onClick={handleSendMessage}
              isDisabled={!newMessage.trim()}
            />
          </Flex>
        </>
      ) : (
        /* 4. WhatsApp Web Classic Welcome / Empty State Screen */
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          w="100%"
          bg="#f0f2f5"
          borderBottom="6px solid"
          borderColor="#00a884"
          px={6}
          textAlign="center"
        >
          <Box maxW="560px" mx="auto">
            {/* WhatsApp Web Computer Graphic */}
            <Flex
              w="80px"
              h="80px"
              borderRadius="full"
              bg="#e7fce3"
              color="#00a884"
              align="center"
              justify="center"
              mx="auto"
              mb={6}
            >
              <Icon as={FaWhatsapp} fontSize="44px" />
            </Flex>

            <Text
              fontSize="32px"
              fontWeight="300"
              color="#41525d"
              fontFamily="'Segoe UI', 'Inter', sans-serif"
              mb={3}
            >
              HowsGoing Web
            </Text>

            <Text fontSize="14px" color="#667781" lineHeight="1.6" mb={8}>
              Send and receive messages with friends and AI assistant seamlessly.
              Connect across devices with real-time sockets and built-in Gemini intelligence.
            </Text>

            <Flex
              justify="center"
              align="center"
              gap={2}
              color="#8696a0"
              fontSize="13px"
              pt={6}
              borderTop="1px solid #e9edef"
            >
              <Icon as={FaLock} fontSize="12px" />
              <Text>End-to-end encrypted</Text>
            </Flex>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default SingleChat;

