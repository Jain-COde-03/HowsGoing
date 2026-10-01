/* eslint-disable no-unused-vars */
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  Avatar,
  Box,
  Flex,
  Icon,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { IoCheckmarkDone } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { ChatState } from "../Context/ChatProvider";

// Deterministic sender color in WhatsApp group chats
const getSenderColor = (name = "") => {
  const colors = [
    "#00a884",
    "#1f7a8c",
    "#0284c7",
    "#7c3aed",
    "#c026d3",
    "#db2777",
    "#ea580c",
    "#d97706",
    "#059669",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatDateDivider = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "TODAY";
  if (isYesterday) return "YESTERDAY";
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const formatMessageTime = (timeString) => {
  if (!timeString) return "";
  return new Date(timeString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ScrollableChat = ({ messages, isGroupChat, isAIChat }) => {
  const { user } = ChatState();

  const getSenderId = (message) => message?.sender?._id;
  const getSenderName = (message) => message?.sender?.name || "Unknown";
  const getSenderPic = (message) => message?.sender?.pic;

  return (
    <ScrollableFeed>
      <Box px={{ base: 2, md: 5 }} py={3}>
        {messages &&
          messages.map((m, i) => {
            const isOwnMessage = getSenderId(m) === user?._id;
            const prevMsg = i > 0 ? messages[i - 1] : null;
            const isSameSenderAsPrev =
              prevMsg && getSenderId(prevMsg) === getSenderId(m);

            // Date divider check
            const currentDate = new Date(m.createdAt).toDateString();
            const prevDate = prevMsg
              ? new Date(prevMsg.createdAt).toDateString()
              : null;
            const showDateDivider = currentDate !== prevDate;

            const senderColor = getSenderColor(getSenderName(m));

            return (
              <React.Fragment key={m._id || i}>
                {/* Date separator pill */}
                {showDateDivider && (
                  <Flex justify="center" my={2}>
                    <Box className="wa-date-pill">
                      {formatDateDivider(m.createdAt)}
                    </Box>
                  </Flex>
                )}

                {/* Message Bubble Container */}
                <Flex
                  width="100%"
                  justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
                  alignItems="flex-end"
                  mb={isSameSenderAsPrev ? "2px" : "8px"}
                >
                  {/* Incoming Group Avatar (only show on last message from sequence if group) */}
                  {!isOwnMessage && isGroupChat && !isSameSenderAsPrev && (
                    <Tooltip label={getSenderName(m)} hasArrow placement="bottom-start">
                      <Avatar
                        size="xs"
                        name={getSenderName(m)}
                        src={getSenderPic(m)}
                        mr={1.5}
                        mb={1}
                        cursor="pointer"
                      />
                    </Tooltip>
                  )}

                  {!isOwnMessage && isGroupChat && isSameSenderAsPrev && (
                    <Box w="24px" mr={1.5} />
                  )}

                  {/* Bubble */}
                  <Box
                    maxW={{ base: "85%", md: "65%" }}
                    minW="80px"
                    position="relative"
                    px="9px"
                    pt="6px"
                    pb="8px"
                    className={isOwnMessage ? "wa-bubble-out" : "wa-bubble-in"}
                  >
                    {/* Group sender name */}
                    {!isOwnMessage && isGroupChat && !isSameSenderAsPrev && (
                      <Text
                        fontSize="12.5px"
                        fontWeight="700"
                        color={senderColor}
                        mb={0.5}
                      >
                        {getSenderName(m)}
                      </Text>
                    )}

                    {/* AI Assistant header badge */}
                    {!isOwnMessage && isAIChat && !isSameSenderAsPrev && (
                      <Flex align="center" gap={1} mb={1}>
                        <Icon as={FaRobot} color="#4338ca" fontSize="12px" />
                        <Text
                          fontSize="11.5px"
                          fontWeight="700"
                          color="#4338ca"
                        >
                          Gemini AI
                        </Text>
                      </Flex>
                    )}

                    {/* Message content */}
                    <Text
                      whiteSpace="pre-wrap"
                      color="#111b21"
                      fontSize="14.2px"
                      lineHeight="1.42"
                      wordBreak="break-word"
                      pr={isOwnMessage ? "44px" : "36px"}
                    >
                      {m.content}
                    </Text>

                    {/* Timestamp and Checkmarks */}
                    <Flex
                      position="absolute"
                      bottom="4px"
                      right="7px"
                      align="center"
                      gap={0.5}
                    >
                      <Text
                        fontSize="11px"
                        color="#667781"
                        userSelect="none"
                      >
                        {formatMessageTime(m.createdAt)}
                      </Text>
                      {isOwnMessage && (
                        <Icon
                          as={IoCheckmarkDone}
                          color="#53bdeb"
                          fontSize="14px"
                        />
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </React.Fragment>
            );
          })}
      </Box>
    </ScrollableFeed>
  );
};

export default ScrollableChat;

