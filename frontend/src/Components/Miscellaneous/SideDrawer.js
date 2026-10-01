/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Spinner,
  Badge,
  Flex,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { IoSearchOutline, IoArrowBack, IoClose } from "react-icons/io5";
import { FaWhatsapp, FaRobot, FaUsers } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../Config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    history.push("/");
  };

  const handleAIChat = async () => {
    try {
      setLoadingChat(true);
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
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error starting AI chat",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter name or email",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
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
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load search results",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chats", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error opening chat",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
        <DrawerOverlay bg="blackAlpha.300" />
        <DrawerContent maxW={{ base: "100%", md: "420px" }}>
          <DrawerHeader
            bg="#008069"
            color="white"
            h="108px"
            p={0}
            display="flex"
            alignItems="flex-end"
            pb={3}
            px={5}
          >
            <Flex align="center" gap={4} w="100%">
              <IconButton
                size="sm"
                variant="ghost"
                icon={<Icon as={IoArrowBack} fontSize="20px" color="white" />}
                onClick={onClose}
                aria-label="Back"
                _hover={{ bg: "whiteAlpha.200" }}
                borderRadius="full"
              />
              <Text fontSize="18px" fontWeight="600">
                Search Contacts
              </Text>
            </Flex>
          </DrawerHeader>

          <DrawerBody p={0} bg="white">
            <Box px={3} py={2} bg="#ffffff" borderBottom="1px solid #e9edef">
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none" h="35px">
                  <Icon as={IoSearchOutline} color="#54656f" fontSize="16px" />
                </InputLeftElement>
                <Input
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  bg="#f0f2f5"
                  border="none"
                  borderRadius="8px"
                  h="35px"
                  fontSize="14px"
                  color="#111b21"
                />
              </InputGroup>
            </Box>

            <Box p={2}>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => accessChat(u._id)}
                  />
                ))
              )}
              {loadingChat && (
                <Flex justify="center" p={4}>
                  <Spinner size="sm" color="#00a884" thickness="3px" />
                </Flex>
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

