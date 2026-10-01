import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box } from "@chakra-ui/react";
import React from "react";

const getConsistentColor = (name = "") => {
  const colors = [
    { bg: "#e7fce3", text: "#008069" },
    { bg: "#eef2ff", text: "#4338ca" },
    { bg: "#fef3c7", text: "#b45309" },
    { bg: "#fce7f3", text: "#be185d" },
    { bg: "#e0f2fe", text: "#0369a1" },
    { bg: "#f3e8ff", text: "#7e22ce" },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const UserBadgeItem = ({ user, handleFunction }) => {
  if (!user) return null;
  const colorScheme = getConsistentColor(user.name);

  return (
    <Badge
      px={2.5}
      py={1}
      borderRadius="full"
      m={1}
      fontSize="xs"
      fontWeight="600"
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      bg={colorScheme.bg}
      color={colorScheme.text}
      border="1px solid"
      borderColor="transparent"
      textTransform="none"
    >
      <span>{user.name || "Unknown"}</span>
      <Box
        as="span"
        cursor="pointer"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        w="16px"
        h="16px"
        borderRadius="full"
        _hover={{ bg: "blackAlpha.200" }}
        onClick={(e) => {
          e.stopPropagation();
          handleFunction();
        }}
      >
        <CloseIcon w={2} h={2} />
      </Box>
    </Badge>
  );
};

export default UserBadgeItem;

