import { ViewIcon } from '@chakra-ui/icons';
import { Avatar, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import UserListItem from '../UserAvatar/UserListItem';
import { ChatState } from '../../Context/ChatProvider';

const GroupProfileModel = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat } = ChatState();

  return (
    <div>
      <IconButton icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="3xl"
            fontWeight="bold"
            fontFamily="Work sans"
            textAlign="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            gap="20px"
          >
            <Avatar size="2xl" name={selectedChat.chatName} />

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontFamily="Work sans"
            >
              Admin :
            </Text>
            <UserListItem key={selectedChat.groupAdmin._id} user={selectedChat.groupAdmin} />
            <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="Work sans">
              Members :
            </Text>
            {selectedChat.users.map((user) => (
              <UserListItem key={user._id} user={user} />
            ))}
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
}

export default GroupProfileModel
