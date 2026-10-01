import { ViewIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { FaShieldAlt } from "react-icons/fa";

const GroupProfileModel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, user } = ChatState();

  if (!selectedChat) return null;

  return (
    <>
      <IconButton
        icon={<ViewIcon />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
        borderRadius="full"
        aria-label="Group info"
      />

      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(2px)" />
        <ModalContent borderRadius="12px" overflow="hidden" boxShadow="2xl">
          <ModalHeader
            bg="#008069"
            color="white"
            fontSize="18px"
            fontWeight="600"
            py={4}
          >
            Group info
          </ModalHeader>
          <ModalCloseButton color="white" mt={1} />
          
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            bg="#f0f2f5"
            p={5}
            gap={3}
          >
            {/* Group Header Card */}
            <Box
              p={4}
              bg="white"
              w="100%"
              borderRadius="10px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              boxShadow="0 1px 3px rgba(11,20,26,0.08)"
            >
              <Avatar
                size="2xl"
                name={selectedChat.chatName}
                bg="#008069"
                color="white"
                mb={3}
                border="3px solid #e7fce3"
              />
              <Text fontSize="20px" fontWeight="700" color="#111b21">
                {selectedChat.chatName}
              </Text>
              <Text fontSize="13px" color="#667781">
                Group • {selectedChat.users?.length || 0} participants
              </Text>
            </Box>

            {/* Participants Section */}
            <Box
              p={4}
              bg="white"
              w="100%"
              borderRadius="10px"
              boxShadow="0 1px 3px rgba(11,20,26,0.08)"
              maxH="260px"
              overflowY="auto"
            >
              <Text fontSize="xs" fontWeight="700" color="#008069" textTransform="uppercase" mb={3}>
                {selectedChat.users?.length || 0} Participants
              </Text>

              {selectedChat.users?.map((member) => {
                const isAdmin = selectedChat.groupAdmin?._id === member._id;
                const isMe = member._id === user?._id;

                return (
                  <Flex
                    key={member._id}
                    py={2}
                    align="center"
                    justify="space-between"
                    borderBottom="1px solid #f0f2f5"
                  >
                    <Flex align="center" gap={3}>
                      <Avatar
                        size="sm"
                        name={member.name}
                        src={member.pic}
                        bg="#00a884"
                        color="white"
                      />
                      <Box>
                        <Text fontSize="14px" fontWeight="600" color="#111b21">
                          {isMe ? "You" : member.name}
                        </Text>
                        <Text fontSize="12px" color="#8696a0">
                          {member.email}
                        </Text>
                      </Box>
                    </Flex>

                    {isAdmin && (
                      <Badge
                        colorScheme="green"
                        bg="#e7fce3"
                        color="#008069"
                        fontSize="10px"
                        borderRadius="4px"
                        px={1.5}
                        py={0.5}
                        textTransform="none"
                      >
                        Group Admin
                      </Badge>
                    )}
                  </Flex>
                );
              })}
            </Box>

            {/* Encryption notice */}
            <Flex align="center" gap={2} color="#8696a0" fontSize="xs">
              <Icon as={FaShieldAlt} color="#008069" />
              <Text>Messages in this group are end-to-end encrypted</Text>
            </Flex>
          </ModalBody>

          <ModalFooter bg="white" borderTop="1px solid #e9edef" py={3}>
            <Button
              bg="#008069"
              color="white"
              _hover={{ bg: "#00a884" }}
              size="sm"
              borderRadius="8px"
              onClick={onClose}
              w="100%"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupProfileModel;

