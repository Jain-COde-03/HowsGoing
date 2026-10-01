import React from "react";
import { Avatar, Box, Text, Flex } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  if (!user) return null;

  return (
    <Box
      px={3}
      py={2.5}
      bg="white"
      _hover={{
        bg: "#f5f6f6",
      }}
      cursor="pointer"
      onClick={handleFunction}
      w="100%"
      display="flex"
      alignItems="center"
      borderRadius="8px"
      transition="background-color 0.15s ease"
      borderBottom="1px solid"
      borderColor="#f0f2f5"
    >
      <Avatar
        mr={3}
        size="md"
        cursor="pointer"
        name={user?.name || "Unknown User"}
        src={user?.pic}
        bg="#00a884"
        color="white"
      />
      <Box flex="1" minW="0">
        <Flex justify="space-between" align="center">
          <Text
            fontSize="15px"
            fontWeight="600"
            color="#111b21"
            noOfLines={1}
          >
            {user?.name || "Unknown User"}
          </Text>
        </Flex>
        <Text
          fontSize="13px"
          color="#667781"
          noOfLines={1}
          mt={0.5}
        >
          {user?.email || "Hey there! I am using HowsGoing."}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

