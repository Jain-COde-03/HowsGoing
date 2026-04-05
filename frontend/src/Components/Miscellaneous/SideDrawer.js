/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
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
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../Config/ChatLogics";

const SideDrawer = () => {
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState(false);
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setloading(false);
      setsearchResult(data);
    } catch (error) {
      setloading(false);
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setloadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chats", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <div>
      <Box
        display="flex"
        flexDirection={"row"}
        justifyContent="space-between"
        alignItems="center"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        w="100%"
        p="12px 20px"
        boxShadow="lg"
        textcolor="white"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            onClick={onOpen}
            variant="ghost"
            color="white"
            _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
            fontSize="lg"
            gap={3}
          >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} fontWeight="500">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          color="white"
          fontWeight="800"
          letterSpacing="1px"
        >
          HowsGoing?
        </Text>

        <Box display="flex" alignItems="center" gap={2}>
          <Menu>
            <MenuButton
              as={Button}
              color="white"
              bg="transparent"
              p={2}
              position="relative"
              m={1}
              _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
              borderRadius="full"
            >
              {notifications.length > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="xs"
                >
                  {notifications.length}
                </Badge>
              )}
              <BellIcon fontSize="xl" />
            </MenuButton>
            <MenuList textColor="black" p={2} boxShadow="lg" borderRadius="lg">
              {!notifications.length && "No New Messages"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif));
                  }}
                  _hover={{ bg: "gray.100" }}
                  borderRadius="md"
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg="transparent"
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
              borderRadius="full"
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
                border="2px solid white"
              />
            </MenuButton>
            <MenuList textcolor="black" boxShadow="lg" borderRadius="lg">
              <ProfileModel user={user}>
                <MenuItem
                  color="black"
                  _hover={{ bg: "gray.100" }}
                  borderRadius="md"
                >
                  My Profile
                </MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem
                color="black"
                onClick={logOutHandler}
                _hover={{ bg: "red.50" }}
                borderRadius="md"
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent borderRadius="xl">
          <DrawerHeader
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            borderRadius="xl 0 0 0"
            fontWeight="800"
            fontSize="lg"
          >
            Search Users
          </DrawerHeader>
          <DrawerBody pt={6}>
            <Box display="flex" pb={4} gap={2}>
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                borderRadius="2xl"
                boxShadow="sm"
                _focus={{ borderColor: "blue.300", boxShadow: "outline" }}
              />
              <Button
                onClick={handleSearch}
                colorScheme="blue"
                borderRadius="2xl"
                fontWeight="600"
              >
                Search
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    accessChat(user._id);
                  }}
                />
              ))
            )}
            {loadingChat && (
              <Spinner ml="auto" display="flex" thickness="4px" />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
