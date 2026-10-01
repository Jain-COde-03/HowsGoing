/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Text,
  Tooltip,
  useToast,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Spinner,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  IoSearchOutline,
  IoCheckmarkDone,
  IoEllipsisVertical,
  IoClose,
  IoArrowBack,
} from "react-icons/io5";
import {
  BsChatLeftTextFill,
  BsFillBellFill,
  BsRobot,
  BsPeopleFill,
  BsPersonFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FaWhatsapp, FaUserPlus, FaRobot, FaUsers } from "react-icons/fa";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import ProfileModel from "./Miscellaneous/ProfileModel";
import UserListItem from "./UserAvatar/UserListItem";
import ChatLoading from "./ChatLoading";

const formatChatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
};

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'unread' | 'groups' | 'ai'
  const [drawerSearch, setDrawerSearch] = useState("");
  const [drawerSearchResult, setDrawerSearchResult] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const toast = useToast();
  const history = useHistory();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    history.push("/");
  };

  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chats", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Failed to fetch chats",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }, [user, setChats, toast]);

  const handleAIChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/ai/chat", config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
    } catch (error) {
      toast({
        title: "Error starting AI chat",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDrawerSearch = async (query) => {
    setDrawerSearch(query);
    if (!query) {
      setDrawerSearchResult([]);
      return;
    }
    try {
      setDrawerLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${query}`, config);
      setDrawerSearchResult(data);
      setDrawerLoading(false);
    } catch (error) {
      setDrawerLoading(false);
      toast({
        title: "Search failed",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chats", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onDrawerClose();
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error creating chat",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, fetchChats]);

  // Filtered Chats based on Search & Tabs
  const filteredChats = chats.filter((chat) => {
    const otherUser = getSenderFull(loggedUser, chat.users);
    const chatTitle = chat.isAIChat
      ? "AI Assistant"
      : !chat.isGroupChat
        ? getSender(loggedUser, chat.users)
        : chat.chatName;

    // Search query filter
    const matchesSearch =
      chatTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (chat.latestMessage?.content || "")
        .toLowerCase()
        .includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === "all") return true;
    if (activeTab === "unread") {
      return notifications.some((n) => n.chat._id === chat._id);
    }
    if (activeTab === "groups") {
      return chat.isGroupChat;
    }
    if (activeTab === "ai") {
      return chat.isAIChat;
    }
    return true;
  });

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      bg="#ffffff"
      w={{ base: "100%", md: "380px", lg: "420px" }}
      h="100%"
      borderRight="1px solid"
      borderColor="#e9edef"
      position="relative"
    >
      {/* 1. WhatsApp Left Sidebar Header */}
      <Flex
        bg="#f0f2f5"
        px={4}
        py={2.5}
        h="60px"
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor="#e9edef"
      >
        {/* User Avatar with Profile Modal */}
        {loggedUser && (
          <ProfileModel user={loggedUser}>
            <Tooltip label="Profile" hasArrow placement="bottom-start">
              <Avatar
                size="sm"
                cursor="pointer"
                name={loggedUser.name}
                src={loggedUser.pic}
                bg="#00a884"
                _hover={{ opacity: 0.85 }}
              />
            </Tooltip>
          </ProfileModel>
        )}

        {/* Action Icons */}
        <Flex align="center" gap={1}>
          {/* AI Chat Quick Button */}
          <Tooltip label="Chat with AI Assistant" hasArrow placement="bottom">
            <IconButton
              size="sm"
              variant="ghost"
              icon={<Icon as={FaRobot} color="#54656f" fontSize="18px" />}
              borderRadius="full"
              _hover={{ bg: "#e9edef", color: "#00a884" }}
              aria-label="AI Chat"
              onClick={handleAIChat}
            />
          </Tooltip>

          {/* New Chat Button */}
          <Tooltip label="New Chat / Search Users" hasArrow placement="bottom">
            <IconButton
              size="sm"
              variant="ghost"
              icon={<Icon as={BsChatLeftTextFill} color="#54656f" fontSize="16px" />}
              borderRadius="full"
              _hover={{ bg: "#e9edef", color: "#111b21" }}
              aria-label="New chat"
              onClick={onDrawerOpen}
            />
          </Tooltip>

          {/* Notifications Menu */}
          <Menu>
            <Tooltip label="Notifications" hasArrow placement="bottom">
              <MenuButton
                as={IconButton}
                size="sm"
                variant="ghost"
                borderRadius="full"
                _hover={{ bg: "#e9edef" }}
                aria-label="Notifications"
                position="relative"
                icon={
                  <>
                    <Icon as={BsFillBellFill} color="#54656f" fontSize="16px" />
                    {notifications.length > 0 && (
                      <Badge
                        position="absolute"
                        top="1px"
                        right="1px"
                        bg="#25d366"
                        color="white"
                        borderRadius="full"
                        fontSize="10px"
                        px={1.5}
                        py={0.2}
                      >
                        {notifications.length}
                      </Badge>
                    )}
                  </>
                }
              />
            </Tooltip>
            <MenuList
              boxShadow="0 4px 12px rgba(11,20,26,0.15)"
              border="1px solid #e9edef"
              borderRadius="8px"
              p={1}
              zIndex={10}
            >
              {!notifications.length ? (
                <MenuItem fontSize="xs" color="#667781" isDisabled>
                  No new messages
                </MenuItem>
              ) : (
                notifications.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    fontSize="sm"
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotifications(notifications.filter((n) => n !== notif));
                    }}
                    _hover={{ bg: "#f5f6f6" }}
                    borderRadius="6px"
                  >
                    <Box>
                      <Text fontWeight="600" color="#111b21">
                        {notif.chat.isGroupChat
                          ? notif.chat.chatName
                          : getSender(loggedUser, notif.chat.users)}
                      </Text>
                      <Text fontSize="xs" color="#667781" noOfLines={1}>
                        {notif.content}
                      </Text>
                    </Box>
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>

          {/* 3-Dots Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              size="sm"
              variant="ghost"
              icon={<Icon as={BsThreeDotsVertical} color="#54656f" fontSize="16px" />}
              borderRadius="full"
              _hover={{ bg: "#e9edef" }}
              aria-label="Menu"
            />
            <MenuList
              boxShadow="0 4px 12px rgba(11,20,26,0.15)"
              border="1px solid #e9edef"
              borderRadius="8px"
              p={1}
              zIndex={10}
            >
              <GroupChatModal>
                <MenuItem
                  icon={<Icon as={FaUsers} color="#54656f" />}
                  fontSize="sm"
                  _hover={{ bg: "#f5f6f6" }}
                  borderRadius="6px"
                >
                  New group
                </MenuItem>
              </GroupChatModal>
              <ProfileModel user={loggedUser || {}}>
                <MenuItem
                  icon={<Icon as={BsPersonFill} color="#54656f" />}
                  fontSize="sm"
                  _hover={{ bg: "#f5f6f6" }}
                  borderRadius="6px"
                >
                  My profile
                </MenuItem>
              </ProfileModel>
              <MenuItem
                icon={<Icon as={FaRobot} color="#54656f" />}
                fontSize="sm"
                onClick={handleAIChat}
                _hover={{ bg: "#f5f6f6" }}
                borderRadius="6px"
              >
                AI Assistant
              </MenuItem>
              <MenuDivider my={1} borderColor="#e9edef" />
              <MenuItem
                fontSize="sm"
                color="red.600"
                onClick={logOutHandler}
                _hover={{ bg: "#fef2f2" }}
                borderRadius="6px"
              >
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* 2. WhatsApp Search & Filter Bar */}
      <Box px={3} py={2} bg="#ffffff" borderBottom="1px solid #f0f2f5">
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none" h="35px">
            <Icon as={IoSearchOutline} color="#54656f" fontSize="16px" />
          </InputLeftElement>
          <Input
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search or start new chat"
            bg="#f0f2f5"
            border="none"
            borderRadius="8px"
            h="35px"
            fontSize="14px"
            color="#111b21"
            _placeholder={{ color: "#8696a0", fontSize: "14px" }}
            _focus={{
              bg: "#ffffff",
              boxShadow: "0 0 0 1px #00a884",
            }}
          />
          {searchFilter && (
            <InputRightElement h="35px">
              <IconButton
                size="xs"
                variant="ghost"
                icon={<Icon as={IoClose} />}
                onClick={() => setSearchFilter("")}
                aria-label="Clear search"
              />
            </InputRightElement>
          )}
        </InputGroup>

        {/* WhatsApp Filter Pills: All | Unread | Groups | AI */}
        <Flex gap={1.5} mt={2} overflowX="auto" pb={1} css={{ "&::-webkit-scrollbar": { display: "none" } }}>
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "groups", label: "Groups" },
            { id: "ai", label: "AI" },
          ].map((tab) => (
            <Button
              key={tab.id}
              size="xs"
              h="26px"
              px={3}
              borderRadius="full"
              fontSize="12px"
              fontWeight={activeTab === tab.id ? "600" : "500"}
              bg={activeTab === tab.id ? "#e7fce3" : "#f0f2f5"}
              color={activeTab === tab.id ? "#008069" : "#54656f"}
              _hover={{
                bg: activeTab === tab.id ? "#e7fce3" : "#e9edef",
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === "unread" && notifications.length > 0 && (
                <Badge
                  ml={1.5}
                  bg="#25d366"
                  color="white"
                  borderRadius="full"
                  fontSize="9px"
                  px={1}
                >
                  {notifications.length}
                </Badge>
              )}
            </Button>
          ))}
        </Flex>
      </Box>

      {/* 3. WhatsApp Chat List */}
      <Box
        flex="1"
        overflowY="auto"
        bg="#ffffff"
        css={{
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { background: "#c1c7cb", borderRadius: "3px" },
        }}
      >
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const otherUser = getSenderFull(loggedUser, chat.users);
            const latestContent = chat.latestMessage?.content || "";
            const isLatestFromMe =
              chat.latestMessage?.sender?._id === loggedUser?._id;
            const latestSenderName =
              chat.latestMessage?.sender?.name ||
              (isLatestFromMe
                ? "You"
                : chat.isAIChat
                  ? "AI"
                  : otherUser?.name || "Unknown");

            const isSelected = selectedChat?._id === chat._id;
            const chatNotifications = notifications.filter(
              (n) => n.chat._id === chat._id
            );
            const hasUnread = chatNotifications.length > 0;

            const chatTitle = chat.isAIChat
              ? "AI Assistant"
              : !chat.isGroupChat
                ? getSender(loggedUser, chat.users)
                : chat.chatName;

            return (
              <Flex
                key={chat._id}
                px={3}
                py={2.5}
                align="center"
                cursor="pointer"
                bg={isSelected ? "#f0f2f5" : "transparent"}
                _hover={{ bg: isSelected ? "#f0f2f5" : "#f5f6f6" }}
                onClick={() => {
                  setSelectedChat(chat);
                  if (hasUnread) {
                    setNotifications(
                      notifications.filter((n) => n.chat._id !== chat._id)
                    );
                  }
                }}
                borderBottom="1px solid"
                borderColor="#f0f2f5"
                transition="background-color 0.15s ease"
              >
                {/* Avatar */}
                <Box position="relative" mr={3}>
                  <Avatar
                    size="md"
                    name={chatTitle}
                    src={
                      chat.isAIChat
                        ? "robot.png"
                        : chat.isGroupChat
                          ? null
                          : otherUser?.pic
                    }
                    bg={chat.isAIChat ? "#4338ca" : chat.isGroupChat ? "#008069" : "#00a884"}
                    color="white"
                  />
                  {chat.isAIChat && (
                    <Badge
                      position="absolute"
                      bottom="-2px"
                      right="-2px"
                      bg="#4f46e5"
                      color="white"
                      fontSize="9px"
                      borderRadius="full"
                      px={1}
                    >
                      AI
                    </Badge>
                  )}
                </Box>

                {/* Chat Details */}
                <Box flex="1" minW="0">
                  <Flex justify="space-between" align="baseline" mb={0.5}>
                    <Text
                      fontSize="16px"
                      fontWeight={hasUnread ? "700" : "600"}
                      color="#111b21"
                      noOfLines={1}
                    >
                      {chatTitle}
                    </Text>
                    <Text
                      fontSize="12px"
                      color={hasUnread ? "#00a884" : "#667781"}
                      fontWeight={hasUnread ? "600" : "400"}
                      whiteSpace="nowrap"
                      ml={2}
                    >
                      {chat.latestMessage
                        ? formatChatTime(chat.latestMessage.createdAt)
                        : formatChatTime(chat.updatedAt)}
                    </Text>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={1} minW="0" flex="1">
                      {isLatestFromMe && (
                        <Icon
                          as={IoCheckmarkDone}
                          color="#53bdeb"
                          fontSize="15px"
                          flexShrink={0}
                        />
                      )}
                      <Text
                        fontSize="13.5px"
                        color={hasUnread ? "#111b21" : "#667781"}
                        fontWeight={hasUnread ? "600" : "400"}
                        noOfLines={1}
                      >
                        {chat.latestMessage ? (
                          <>
                            {chat.isGroupChat && !isLatestFromMe && (
                              <b>{latestSenderName}: </b>
                            )}
                            {latestContent}
                          </>
                        ) : chat.isAIChat ? (
                          "Ask Gemini anything..."
                        ) : (
                          "Click to start chatting"
                        )}
                      </Text>
                    </Flex>

                    {/* Unread Badge Counter */}
                    {hasUnread && (
                      <Badge
                        bg="#25d366"
                        color="white"
                        borderRadius="full"
                        fontSize="11px"
                        fontWeight="600"
                        px={1.5}
                        py={0.2}
                        ml={2}
                      >
                        {chatNotifications.length}
                      </Badge>
                    )}
                  </Flex>
                </Box>
              </Flex>
            );
          })
        ) : (
          <Box p={8} textAlign="center" color="#8696a0">
            <Icon as={FaWhatsapp} fontSize="36px" color="#c1c7cb" mb={2} />
            <Text fontSize="sm" fontWeight="500">
              No chats found
            </Text>
            <Text fontSize="xs" mt={1}>
              {searchFilter
                ? "Try a different search term"
                : "Click the pencil icon above to start a conversation"}
            </Text>
          </Box>
        )}
      </Box>

      {/* 4. WhatsApp Slide-in Drawer for New Chat / Contacts Search */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={onDrawerClose}
        size="sm"
      >
        <DrawerOverlay bg="blackAlpha.300" />
        <DrawerContent maxW={{ base: "100%", md: "420px" }}>
          {/* WhatsApp Drawer Teal Header */}
          <DrawerHeader
            bg="#008069"
            color="white"
            h="108px"
            p={0}
            display="flex"
            alignItems="flex-end"
            pb={3}
            px={5}
          >
            <Flex align="center" gap={4} w="100%">
              <IconButton
                size="sm"
                variant="ghost"
                icon={<Icon as={IoArrowBack} fontSize="20px" color="white" />}
                onClick={onDrawerClose}
                aria-label="Back"
                _hover={{ bg: "whiteAlpha.200" }}
                borderRadius="full"
              />
              <Text fontSize="18px" fontWeight="600">
                New chat
              </Text>
            </Flex>
          </DrawerHeader>

          <DrawerBody p={0} bg="white">
            {/* Search Input Box */}
            <Box px={3} py={2} bg="#ffffff" borderBottom="1px solid #e9edef">
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none" h="35px">
                  <Icon as={IoSearchOutline} color="#54656f" fontSize="16px" />
                </InputLeftElement>
                <Input
                  placeholder="Search name or email..."
                  value={drawerSearch}
                  onChange={(e) => handleDrawerSearch(e.target.value)}
                  bg="#f0f2f5"
                  border="none"
                  borderRadius="8px"
                  h="35px"
                  fontSize="14px"
                  color="#111b21"
                  _placeholder={{ color: "#8696a0" }}
                  _focus={{
                    bg: "#ffffff",
                    boxShadow: "0 0 0 1px #00a884",
                  }}
                />
                {drawerSearch && (
                  <InputRightElement h="35px">
                    <IconButton
                      size="xs"
                      variant="ghost"
                      icon={<Icon as={IoClose} />}
                      onClick={() => handleDrawerSearch("")}
                      aria-label="Clear"
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </Box>

            {/* Quick Actions in New Chat Panel: New Group | AI Assistant */}
            <Box py={1} borderBottom="1px solid #f0f2f5">
              <GroupChatModal>
                <Flex
                  px={4}
                  py={3}
                  align="center"
                  gap={4}
                  cursor="pointer"
                  _hover={{ bg: "#f5f6f6" }}
                  onClick={onDrawerClose}
                >
                  <Flex
                    w="40px"
                    h="40px"
                    borderRadius="full"
                    bg="#00a884"
                    color="white"
                    align="center"
                    justify="center"
                  >
                    <Icon as={FaUsers} fontSize="18px" />
                  </Flex>
                  <Text fontSize="15px" fontWeight="600" color="#111b21">
                    New group
                  </Text>
                </Flex>
              </GroupChatModal>

              <Flex
                px={4}
                py={3}
                align="center"
                gap={4}
                cursor="pointer"
                _hover={{ bg: "#f5f6f6" }}
                onClick={() => {
                  handleAIChat();
                  onDrawerClose();
                }}
              >
                <Flex
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg="#4338ca"
                  color="white"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaRobot} fontSize="18px" />
                </Flex>
                <Box>
                  <Text fontSize="15px" fontWeight="600" color="#111b21">
                    Gemini AI Assistant
                  </Text>
                  <Text fontSize="12px" color="#667781">
                    Instant answers & conversations
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* Contact Results Header */}
            <Box px={4} py={2} bg="#f0f2f5">
              <Text fontSize="xs" fontWeight="700" color="#008069" textTransform="uppercase" letterSpacing="0.5px">
                Contacts on HowsGoing
              </Text>
            </Box>

            {/* Results List */}
            <Box p={2}>
              {drawerLoading ? (
                <ChatLoading />
              ) : drawerSearchResult?.length > 0 ? (
                drawerSearchResult.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => accessChat(u._id)}
                  />
                ))
              ) : drawerSearch ? (
                <Box p={6} textAlign="center" color="#8696a0">
                  <Text fontSize="sm">No contacts found</Text>
                </Box>
              ) : (
                <Box p={6} textAlign="center" color="#8696a0">
                  <Text fontSize="sm">Type a name or email to search</Text>
                </Box>
              )}
              {loadingChat && (
                <Flex justify="center" p={4}>
                  <Spinner size="sm" color="#00a884" thickness="3px" />
                </Flex>
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default MyChats;

