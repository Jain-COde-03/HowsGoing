import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  if (!user) return null;

  return (
    <Box
      px={3}
      py={2}
      mt={2}
      bg="gray.100"
      _hover={{
        bg: "blue.500",
        color: "white",
      }}
      cursor="pointer"
      onClick={handleFunction}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user?.name || "Unknown User"}
        src={user?.pic}
      />
      <Box>
        <Text fontSize="md">{user?.name || "Unknown User"}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user?.email || "-"}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
