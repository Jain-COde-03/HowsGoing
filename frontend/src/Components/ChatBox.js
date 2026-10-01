/* eslint-disable no-unused-vars */
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      flex="1"
      h="100%"
      w={{ base: "100%", md: "calc(100% - 380px)", lg: "calc(100% - 420px)" }}
      bg="#efeae2"
      position="relative"
      overflow="hidden"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;

