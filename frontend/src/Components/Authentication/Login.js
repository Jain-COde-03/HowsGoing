import React from "react";
import { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  useToast,
  Box,
  Text,
  Icon,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import axios from "axios";
import { useHistory } from "react-router-dom";
<<<<<<< HEAD
=======
import { ChatState } from "../../Context/ChatProvider";
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)

const Login = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
<<<<<<< HEAD
=======
  const { setUser } = ChatState();
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        config,
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
<<<<<<< HEAD
=======
      setUser(data);
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={6} w="100%">
      <Box textAlign="center" mb={4}>
        <Text fontSize="2xl" fontWeight="700" color="gray.700" mb={2}>
          Welcome Back
        </Text>
        <Text fontSize="md" color="gray.500">
          Sign in to continue to your account
        </Text>
      </Box>

      <FormControl id="email" isRequired>
        <Flex alignItems="center" gap={4}>
          <FormLabel
            color="gray.600"
            fontWeight="600"
            fontSize="sm"
            minW="100px"
            mb="0"
          >
            Email
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaEnvelope} color="gray.400" />
            </InputLeftElement>
            <Input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              placeholder="Enter your email"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ borderColor: "blue.300" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #667eea",
                bg: "white",
              }}
              borderRadius="xl"
              size="md"
              fontSize="sm"
            />
          </InputGroup>
        </Flex>
      </FormControl>

      <FormControl id="password" isRequired>
        <Flex alignItems="center" gap={4}>
          <FormLabel
            color="gray.600"
            fontWeight="600"
            fontSize="sm"
            minW="100px"
            mb="0"
          >
            Password
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaLock} color="gray.400" />
            </InputLeftElement>
            <Input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ borderColor: "blue.300" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #667eea",
                bg: "white",
              }}
              borderRadius="xl"
              size="md"
              fontSize="sm"
            />
            <InputRightElement>
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShow(!show)}
                variant="ghost"
                color="gray.500"
                _hover={{ color: "blue.500" }}
              >
                <Icon as={show ? FaEyeSlash : FaEye} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
      </FormControl>

      <Button
        isLoading={loading}
        onClick={submitHandler}
        colorScheme="blue"
        width="100%"
        size="lg"
        borderRadius="xl"
        fontWeight="600"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        _hover={{
          bg: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
          transform: "translateY(-1px)",
          boxShadow: "lg",
        }}
        _active={{
          transform: "translateY(0)",
        }}
        transition="all 0.2s"
        mt={4}
      >
        Sign In
      </Button>

      <Box w="100%" position="relative" py={4}>
        <Divider />
        <Text
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="white"
          px={4}
          fontSize="sm"
          color="gray.500"
          fontWeight="500"
        >
          OR
        </Text>
      </Box>

      <Button
        onClick={() => {
          setEmail("guest123@example.com");
          setPassword("guest123");
        }}
        variant="outline"
        colorScheme="purple"
        width="100%"
        size="lg"
        borderRadius="xl"
        fontWeight="600"
        leftIcon={<Icon as={FaUser} />}
        _hover={{
          bg: "purple.50",
          borderColor: "purple.300",
          transform: "translateY(-1px)",
          boxShadow: "md",
        }}
        transition="all 0.2s"
      >
        Continue as Guest
      </Button>
    </VStack>
  );
};

export default Login;
