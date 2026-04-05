/* eslint-disable no-unused-vars */
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      h="100%"
      p={4}
      bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      w={{ base: "100%", md: "69%" }}
      borderRadius="xl"
      boxShadow="lg"
      color="black"
      gap={2}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
