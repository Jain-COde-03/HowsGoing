/* eslint-disable no-unused-vars */
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../Config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const formatMessageTime = (timeString) => {
    if (!timeString) return "";
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if this is the first message from a sender (or message is from current user)
  const isFirstMessageFromSender = (messages, currentMsg, index, userId) => {
    if (currentMsg.sender._id === userId) return false;
    return (
      index === 0 || messages[index - 1].sender._id !== currentMsg.sender._id
    );
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isOwnMessage = m.sender._id === user._id;
          const isFirstMsg = isFirstMessageFromSender(messages, m, i, user._id);

          return (
            <Box
              key={m._id}
              display="flex"
              width="100%"
              justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
              alignItems="flex-start"
              mb={isSameUser(messages, m, i) ? 1 : 4}
            >
              {!isOwnMessage && isFirstMsg && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                    mr={2}
                    mt={1}
                  />
                </Tooltip>
              )}

              {!isOwnMessage && !isFirstMsg && <Box w={10} mr={2} />}

              <Box maxW="75%" minW="200px">
                <Box
                  bg={
                    isOwnMessage
                      ? "linear-gradient(135deg, #d7f3fe 0%, #a0d8ff 100%)"
                      : "white"
                  }
                  border={"1px solid"}
                  borderColor={isOwnMessage ? "blue.100" : "gray.200"}
                  boxShadow="sm"
                  borderRadius="20px"
                  borderTopRightRadius={isOwnMessage ? "6px" : "20px"}
                  borderTopLeftRadius={!isOwnMessage ? "6px" : "20px"}
                  p={3}
                  ml={isOwnMessage ? 2 : 0}
                  mr={!isOwnMessage ? 2 : 0}
                  position="relative"
                >
                  {isFirstMsg && (
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color={isOwnMessage ? "blue.700" : "gray.600"}
                      position="absolute"
                      top="8px"
                      left="12px"
                      zIndex="1"
                    >
                      {isOwnMessage ? "You" : m.sender.name}
                    </Text>
                  )}

                  <Text
                    whiteSpace="pre-wrap"
                    color="gray.800"
                    lineHeight="1.6"
                    pt={isFirstMsg ? 4 : 0}
                    pb={2}
                  >
                    {m.content}
                  </Text>

                  <Text
                    fontSize="xx-small"
                    color="gray.500"
                    position="absolute"
                    bottom="6px"
                    right="12px"
                  >
                    {formatMessageTime(m.createdAt)}
                  </Text>
                </Box>
              </Box>
            </Box>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
