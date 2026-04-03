import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const getRandomColor = () => {
  const colors = [
    "#E53E3E",
    "#DD6B20",
    "#D69E2E",
    "#38A169",
    "#3182CE",
    "#805AD5",
    "#6B46C1",
    "#2C7A7B",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const UserBadgeItem = ({ user, handleFunction }) => {
  if (!user) return null;

  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      variant="solid"
      fontSize={14}
      color="white"
      bg={getRandomColor()}
      cursor="default"
    >
      {user.name || "Unknown"}

      <CloseIcon
        pl={1}
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleFunction();
        }}
      />
    </Box>
  );
};

export default UserBadgeItem;
