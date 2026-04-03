/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { getSender } from "../Config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
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
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      h="100%"
      borderLeftRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="black"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<i className="fas fa-plus"></i>}
            colorScheme="blue"
            onClick={() => {}}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto"
      >
        {chats.length > 0 ? (
          <Stack h="100%" overflowY="auto">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                p={2}
                onClick={() => setSelectedChat(chat)}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                cursor="pointer"
                display="flex"
                alignItems="center"
              >
                <Avatar
                  mr={2}
                  size="sm"
                  name={
                    chat.isGroupChat
                      ? chat.chatName
                      : getSender(loggedUser, chat.users)
                  }
                  src={
                    chat.isGroupChat
                      ? null
                      : chat.users.find((u) => u._id !== loggedUser._id)?.pic
                  }
                />
                <Box>
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  <Text fontSize="xs">
                    {chat.latestMessage
                      ? `${chat.latestMessage.sender.name}: ${
                          chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content
                        }`
                      : "No messages yet"}
                  </Text>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box p={4} color="gray">
            No chats available
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
