/* eslint-disable no-unused-vars */
import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Icon,
  IconButton,
  Button,
  Text,
  Avatar,
  Box,
  Flex,
  Divider,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEnvelope, FaUser, FaInfoCircle, FaShieldAlt } from "react-icons/fa";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!user) return null;

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display="flex"
          icon={<ViewIcon />}
          onClick={onOpen}
          variant="ghost"
          borderRadius="full"
          aria-label="View profile"
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(2px)" />
        <ModalContent borderRadius="12px" overflow="hidden" boxShadow="2xl">
          {/* WhatsApp Header Strip */}
          <ModalHeader
            bg="#008069"
            color="white"
            fontSize="18px"
            fontWeight="600"
            py={4}
          >
            Contact info
          </ModalHeader>
          <ModalCloseButton color="white" mt={1} />
          
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            bg="#f0f2f5"
            p={6}
            gap={4}
          >
            {/* Avatar Section */}
            <Box
              p={4}
              bg="white"
              w="100%"
              borderRadius="10px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              boxShadow="0 1px 3px rgba(11,20,26,0.08)"
            >
              <Avatar
                size="2xl"
                name={user.name || "User"}
                src={user.pic}
                bg="#00a884"
                color="white"
                mb={3}
                border="3px solid #e7fce3"
              />
              <Text fontSize="20px" fontWeight="700" color="#111b21">
                {user.name}
              </Text>
              <Text fontSize="13px" color="#667781">
                Active on HowsGoing
              </Text>
            </Box>

            {/* About / Status Section */}
            <Box
              p={4}
              bg="white"
              w="100%"
              borderRadius="10px"
              boxShadow="0 1px 3px rgba(11,20,26,0.08)"
            >
              <Text fontSize="xs" fontWeight="700" color="#008069" textTransform="uppercase" mb={1}>
                About
              </Text>
              <Text fontSize="14px" color="#111b21">
                Hey there! I am using HowsGoing.
              </Text>
            </Box>

            {/* Email / Details Section */}
            <Box
              p={4}
              bg="white"
              w="100%"
              borderRadius="10px"
              boxShadow="0 1px 3px rgba(11,20,26,0.08)"
            >
              <Text fontSize="xs" fontWeight="700" color="#008069" textTransform="uppercase" mb={2}>
                Account details
              </Text>
              <Flex align="center" gap={3} color="#111b21" fontSize="14px">
                <Icon as={FaEnvelope} color="#8696a0" />
                <Text>{user.email}</Text>
              </Flex>
            </Box>

            {/* Security Notice */}
            <Flex align="center" gap={2} color="#8696a0" fontSize="xs">
              <Icon as={FaShieldAlt} color="#008069" />
              <Text>Messages are end-to-end encrypted</Text>
            </Flex>
          </ModalBody>

          <ModalFooter bg="white" borderTop="1px solid #e9edef" py={3}>
            <Button
              bg="#008069"
              color="white"
              _hover={{ bg: "#00a884" }}
              size="sm"
              borderRadius="8px"
              onClick={onClose}
              w="100%"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;

