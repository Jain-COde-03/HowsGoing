/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
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
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { IoSearchOutline, IoSettingsOutline } from "react-icons/io5";
import { FaEdit, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove participants",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chats/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config,
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Failed to remove user",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config,
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
      toast({
        title: "Group Name Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Rename Failed",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Search Failed",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User Already in Group",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add participants",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chats/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config,
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        title: "Participant Added",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Add User",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        icon={<Icon as={IoSettingsOutline} fontSize="18px" color="#54656f" />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
        borderRadius="full"
        _hover={{ bg: "#e9edef" }}
        aria-label="Group settings"
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
            Group settings
          </ModalHeader>
          <ModalCloseButton color="white" mt={1} />
          
          <ModalBody p={5} bg="white">
            {/* Current Members Badges */}
            <Box mb={4}>
              <Text fontSize="xs" fontWeight="700" color="#54656f" textTransform="uppercase" mb={2}>
                Group members ({selectedChat.users.length})
              </Text>
              <Flex wrap="wrap" gap={1} p={2} bg="#f8fafc" borderRadius="8px" border="1px solid #f0f2f5">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Flex>
            </Box>

            {/* Change Group Name */}
            <FormControl mb={4}>
              <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1}>
                Change group name
              </FormLabel>
              <Flex gap={2}>
                <Input
                  placeholder={selectedChat.chatName}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  bg="#f0f2f5"
                  border="none"
                  borderRadius="8px"
                  fontSize="14px"
                  _focus={{
                    bg: "white",
                    boxShadow: "0 0 0 1px #00a884",
                  }}
                />
                <Button
                  bg="#008069"
                  color="white"
                  _hover={{ bg: "#00a884" }}
                  size="md"
                  borderRadius="8px"
                  fontSize="xs"
                  fontWeight="600"
                  isLoading={renameloading}
                  onClick={handleRename}
                  isDisabled={!groupChatName.trim()}
                >
                  Update
                </Button>
              </Flex>
            </FormControl>

            {/* Add Member Search */}
            <FormControl mb={3}>
              <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1}>
                Add participant
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={IoSearchOutline} color="#8696a0" />
                </InputLeftElement>
                <Input
                  placeholder="Search contacts to add..."
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

            {/* Search Results */}
            <Box maxH="140px" overflowY="auto">
              {loading ? (
                <Flex justify="center" p={2}>
                  <Spinner size="sm" color="#00a884" />
                </Flex>
              ) : (
                searchResult?.slice(0, 3).map((userItem) => (
                  <UserListItem
                    key={userItem._id}
                    user={userItem}
                    handleFunction={() => handleAddUser(userItem)}
                  />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter bg="#f0f2f5" borderTop="1px solid #e9edef" py={3} justify="space-between">
            <Button
              colorScheme="red"
              variant="ghost"
              size="sm"
              borderRadius="8px"
              leftIcon={<Icon as={FaSignOutAlt} />}
              onClick={() => handleRemove(user)}
              isLoading={loading}
              _hover={{ bg: "#fef2f2" }}
            >
              Exit Group
            </Button>
            <Button
              variant="outline"
              size="sm"
              borderRadius="8px"
              onClick={onClose}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;

