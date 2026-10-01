/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { IoSearchOutline, IoPeople } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState("");
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [creating, setCreating] = useState(false);

  const toast = useToast();
  const { user, chats, setChats, setSelectedChat } = ChatState();

  const handleSearch = async (query) => {
    setsearch(query);
    if (!query) {
      setsearchResult([]);
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${query}`, config);
      setsearchResult(data);
      setloading(false);
    } catch (error) {
      setloading(false);
      toast({
        title: "Search failed",
        description: "Failed to load search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setselectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Incomplete details",
        description: "Please enter a group name and add at least one member",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setCreating(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      );
      setChats([data, ...chats]);
      setSelectedChat(data);
      setCreating(false);
      onClose();
      toast({
        title: "Group Created!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      setCreating(false);
      const description =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unknown error";

      toast({
        title: "Failed to create group",
        description,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleDelete = (userToDelete) => {
    setselectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id),
    );
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

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
            Create new group
          </ModalHeader>
          <ModalCloseButton color="white" mt={1} />
          
          <ModalBody p={5} bg="white">
            <FormControl mb={4} isRequired>
              <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1}>
                Group subject
              </FormLabel>
              <Input
                placeholder="Enter group subject"
                value={groupChatName}
                onChange={(e) => setgroupChatName(e.target.value)}
                bg="#f0f2f5"
                border="none"
                borderRadius="8px"
                fontSize="14px"
                _focus={{
                  bg: "white",
                  boxShadow: "0 0 0 1px #00a884",
                }}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1}>
                Add members
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={IoSearchOutline} color="#8696a0" />
                </InputLeftElement>
                <Input
                  placeholder="Search contacts by name or email"
                  onChange={(e) => handleSearch(e.target.value)}
                  bg="#f0f2f5"
                  border="none"
                  borderRadius="8px"
                  fontSize="13px"
                  _focus={{
                    bg: "white",
                    boxShadow: "0 0 0 1px #00a884",
                  }}
                />
              </InputGroup>
            </FormControl>

            {/* Selected Users Chips */}
            {selectedUsers.length > 0 && (
              <Box mb={3} p={2} bg="#f8fafc" borderRadius="8px" border="1px solid #f0f2f5">
                <Text fontSize="11px" fontWeight="600" color="#8696a0" mb={1} textTransform="uppercase">
                  Selected ({selectedUsers.length})
                </Text>
                <Flex wrap="wrap" gap={1}>
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </Flex>
              </Box>
            )}

            {/* Search Results */}
            <Box maxH="180px" overflowY="auto">
              {loading ? (
                <Flex justify="center" p={3}>
                  <Spinner size="sm" color="#00a884" />
                </Flex>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((userItem) => (
                    <UserListItem
                      key={userItem._id}
                      user={userItem}
                      handleFunction={() => handleGroup(userItem)}
                    />
                  ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter bg="#f0f2f5" borderTop="1px solid #e9edef" py={3}>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              size="sm"
              borderRadius="8px"
            >
              Cancel
            </Button>
            <Button
              bg="#008069"
              color="white"
              _hover={{ bg: "#00a884" }}
              size="sm"
              borderRadius="8px"
              onClick={handleSubmit}
              isLoading={creating}
              isDisabled={!groupChatName.trim() || selectedUsers.length === 0}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;

