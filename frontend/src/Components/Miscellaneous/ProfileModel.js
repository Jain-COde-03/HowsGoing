/* eslint-disable no-unused-vars */
import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Icon, IconButton , Button, Image, Text} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { ViewIcon } from "@chakra-ui/icons";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="3xl" fontWeight="bold" fontFamily="Work sans" textAlign="center">
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody 
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            gap="20px"
          >
            <Image
              src={user.pic}
              alt={user.name}
              borderRadius="full"
              boxSize="150px"
              margin="0 auto"
            />

            <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="Work sans">
              Email : {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModel;
