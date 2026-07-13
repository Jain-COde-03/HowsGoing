import React, { useCallback, useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Box, Button, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chats", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch chats",
        status: "error",
        duration: 5000,
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
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, fetchChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      p={4}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      h="100%"
      borderRadius="xl"
      boxShadow="lg"
      gap={4}
    >
      <Box
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="black"
      >
        <Text fontSize="2xl" fontWeight="800" fontFamily="Work sans">
          My Chats
        </Text>
        <Box display="flex" gap={2}>
          <Button
            size="sm"
            colorScheme="purple"
            leftIcon={<i className="fas fa-robot"></i>}
            borderRadius="full"
            fontSize="sm"
            onClick={handleAIChat}
          >
            AI Chat
          </Button>
          <GroupChatModal>
            <Button
              size="sm"
              colorScheme="blue"
              leftIcon={<i className="fas fa-plus"></i>}
              borderRadius="full"
              fontSize="sm"
            >
              Group
            </Button>
          </GroupChatModal>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        bg="gray.50"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto"
        gap={2}
        p={2}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#CBD5E0",
            borderRadius: "12px",
          },
        }}
      >
        {chats.length > 0 ? (
          chats.map((chat) => {
            const otherUser = getSenderFull(loggedUser, chat.users);
            const latestContent = chat.latestMessage?.content || "";
            const latestSenderName =
              chat.latestMessage?.sender?.name ||
              (chat.latestMessage?.sender?._id === loggedUser?._id
                ? "You"
                : chat.isAIChat
                  ? "AI Assistant"
                  : otherUser?.name || "Unknown User");

            return (
            <Box
              key={chat._id}
              p={3}
              onClick={() => setSelectedChat(chat)}
              bg={
                selectedChat === chat
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "white"
              }
              color={selectedChat === chat ? "white" : "black"}
              cursor="pointer"
              display="flex"
              alignItems="center"
              gap={3}
              borderRadius="lg"
              boxShadow={selectedChat === chat ? "md" : "sm"}
              transition="all 0.2s"
              _hover={{
                boxShadow: "md",
                transform: "translateY(-2px)",
              }}
            >
              <Avatar
                size="sm"
                name={
                  chat.isAIChat
                    ? "AI Assistant"
                    : chat.isGroupChat
                      ? chat.chatName
                      : getSender(loggedUser, chat.users)
                }
                src={
                  chat.isAIChat
                    ? "robot.png"
                    : chat.isGroupChat
                      ? null
                      : otherUser?.pic
                }
              />
              <Box flex="1" minW="0">
                <Text fontWeight="700" noOfLines={1}>
                  {chat.isAIChat
                    ? "🤖 AI Assistant"
                    : !chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                </Text>
                <Text fontSize="xs" opacity={0.8} noOfLines={1}>
                  {chat.latestMessage
                    ? `${latestSenderName}: ${
                        latestContent.length > 50
                          ? latestContent.substring(0, 51) + "..."
                          : latestContent
                      }`
                    : chat.isAIChat
                      ? "AI-powered conversations"
                      : "No messages yet"}
                </Text>
              </Box>
            </Box>
            );
          })
        ) : (
          <Box p={8} textAlign="center" color="gray.400">
            <Text fontSize="lg" fontWeight="500">
              No chats yet
            </Text>
            <Text fontSize="sm">Start a conversation to get rolling</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
