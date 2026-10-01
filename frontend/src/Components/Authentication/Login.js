import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserCheck } from "react-icons/fa";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 4000,
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
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} w="100%" align="stretch">
      <Box mb={2}>
        <Text fontSize="xl" fontWeight="600" color="#111b21">
          Welcome back
        </Text>
        <Text fontSize="sm" color="#667781">
          Enter your details to access your chats
        </Text>
      </Box>

      <FormControl id="email" isRequired>
        <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1.5}>
          Email address
        </FormLabel>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaEnvelope} color="#8696a0" />
          </InputLeftElement>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="you@example.com"
            bg="#f0f2f5"
            border="1px solid transparent"
            _hover={{ bg: "#e9edef" }}
            _focus={{
              borderColor: "#00a884",
              bg: "#ffffff",
              boxShadow: "0 0 0 1px #00a884",
            }}
            borderRadius="8px"
            fontSize="sm"
            color="#111b21"
          />
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1.5}>
          Password
        </FormLabel>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaLock} color="#8696a0" />
          </InputLeftElement>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter password"
            bg="#f0f2f5"
            border="1px solid transparent"
            _hover={{ bg: "#e9edef" }}
            _focus={{
              borderColor: "#00a884",
              bg: "#ffffff",
              boxShadow: "0 0 0 1px #00a884",
            }}
            borderRadius="8px"
            fontSize="sm"
            color="#111b21"
            onKeyDown={(e) => {
              if (e.key === "Enter") submitHandler();
            }}
          />
          <InputRightElement>
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShow(!show)}
              variant="ghost"
              color="#8696a0"
              _hover={{ color: "#111b21", bg: "transparent" }}
            >
              <Icon as={show ? FaEyeSlash : FaEye} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        isLoading={loading}
        onClick={submitHandler}
        bg="#008069"
        color="white"
        width="100%"
        size="md"
        borderRadius="8px"
        fontWeight="600"
        fontSize="sm"
        _hover={{
          bg: "#00a884",
        }}
        _active={{
          bg: "#075e54",
        }}
        mt={2}
        transition="all 0.2s"
      >
        Log In
      </Button>

      <Box w="100%" position="relative" py={3}>
        <Divider borderColor="#e9edef" />
        <Text
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="white"
          px={3}
          fontSize="xs"
          color="#8696a0"
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
        borderColor="#00a884"
        color="#008069"
        bg="#f0fdf4"
        width="100%"
        size="md"
        borderRadius="8px"
        fontWeight="600"
        fontSize="sm"
        leftIcon={<Icon as={FaUserCheck} />}
        _hover={{
          bg: "#e7fce3",
          borderColor: "#008069",
        }}
        transition="all 0.2s"
      >
        Fill Guest Credentials
      </Button>
    </VStack>
  );
};

export default Login;

