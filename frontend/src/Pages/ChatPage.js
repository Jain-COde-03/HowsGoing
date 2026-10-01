/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <Box
      w="100vw"
      h="100vh"
      bg="#d1d7db"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {/* WhatsApp Web Green Top Banner Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        h="127px"
        bg="#00a884"
        zIndex="0"
      />

      {/* WhatsApp Web Two-Panel App Shell */}
      <Flex
        position="relative"
        zIndex="1"
        w={{ base: "100%", "2xl": "1600px" }}
        h={{ base: "100%", "2xl": "calc(100vh - 38px)" }}
        my={{ base: 0, "2xl": "19px" }}
        bg="#ffffff"
        boxShadow={{ base: "none", "2xl": "0 6px 18px rgba(11,20,26,0.12)" }}
        overflow="hidden"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;

