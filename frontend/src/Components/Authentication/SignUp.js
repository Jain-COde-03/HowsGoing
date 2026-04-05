/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
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
  Progress,
  Flex,
} from "@chakra-ui/react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const SignUp = () => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const history = useHistory();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chat-App");
      data.append("cloud_name", "dzqiwkcet");

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      fetch("https://api.cloudinary.com/v1_1/dzqiwkcet/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString());
          setUploadProgress(100);
          setTimeout(() => setUploadProgress(0), 1000);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setUploadProgress(0);
        });
    } else {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
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
        "/api/users",
        { name, email, password, pic },
        config,
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
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

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <VStack spacing={3} w="100%">
      <Box textAlign="center" mb={4}>
        <Text fontSize="2xl" fontWeight="700" color="gray.700" mb={2}>
          Create Account
        </Text>
        <Text fontSize="md" color="gray.500">
          Join the conversation today
        </Text>
      </Box>

      <FormControl id="name" isRequired>
        <Flex alignItems="center" gap={4}>
          <FormLabel
            color="gray.600"
            fontWeight="600"
            fontSize="sm"
            minW="100px"
            mb="0"
          >
            Full Name
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaUser} color="gray.400" />
            </InputLeftElement>
            <Input
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
              placeholder="Enter your full name"
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
        <Flex alignItems="flex-start" gap={4} flexDirection="column">
          <Flex alignItems="center" gap={4} w="100%">
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
                placeholder="Create a strong password"
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
          {password && (
            <Box w="100%" pl="104px">
              <Progress
                value={(passwordStrength / 5) * 100}
                size="sm"
                colorScheme={
                  passwordStrength < 3
                    ? "red"
                    : passwordStrength < 4
                      ? "yellow"
                      : "green"
                }
                borderRadius="md"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Password strength:{" "}
                {passwordStrength < 3
                  ? "Weak"
                  : passwordStrength < 4
                    ? "Medium"
                    : "Strong"}
              </Text>
            </Box>
          )}
        </Flex>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <Flex alignItems="flex-start" gap={4} flexDirection="column">
          <Flex alignItems="center" gap={4} w="100%">
            <FormLabel
              color="gray.600"
              fontWeight="600"
              fontSize="sm"
              minW="100px"
              mb="0"
            >
              Confirm
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon
                  as={passwordsMatch ? FaCheck : FaTimes}
                  color={passwordsMatch ? "green.400" : "red.400"}
                />
              </InputLeftElement>
              <Input
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                value={confirmPassword}
                type={show ? "text" : "password"}
                placeholder="Confirm your password"
                bg="gray.50"
                border="1px solid"
                borderColor={passwordsMatch ? "green.200" : "gray.200"}
                _hover={{
                  borderColor: passwordsMatch ? "green.300" : "blue.300",
                }}
                _focus={{
                  borderColor: passwordsMatch ? "green.500" : "blue.500",
                  boxShadow: `0 0 0 1px ${passwordsMatch ? "#48BB78" : "#667eea"}`,
                  bg: "white",
                }}
                borderRadius="xl"
                size="md"
                fontSize="sm"
              />
            </InputGroup>
          </Flex>
          {confirmPassword && (
            <Text
              fontSize="xs"
              color={passwordsMatch ? "green.500" : "red.500"}
              pl="104px"
            >
              {passwordsMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
            </Text>
          )}
        </Flex>
      </FormControl>

      <FormControl id="pic">
        <Flex alignItems="flex-start" gap={4} flexDirection="column">
          <Flex alignItems="center" gap={4} w="100%">
            <FormLabel
              color="gray.600"
              fontWeight="600"
              fontSize="sm"
              minW="100px"
              mb="0"
            >
              Picture
            </FormLabel>
            <Box position="relative" w="100%">
              <Input
                onChange={(e) => {
                  postDetails(e.target.files[0]);
                }}
                type="file"
                p={1.5}
                accept="image/*"
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="xl"
                bg="gray.50"
                _hover={{ borderColor: "blue.300", bg: "blue.50" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #667eea",
                }}
                sx={{
                  "::file-selector-button": {
                    border: "none",
                    bg: "blue.500",
                    color: "white",
                    borderRadius: "lg",
                    padding: "4px 12px",
                    marginRight: "8px",
                    cursor: "pointer",
                    fontWeight: "500",
                  },
                }}
              />
              {uploadProgress > 0 && (
                <Progress
                  value={uploadProgress}
                  size="sm"
                  colorScheme="blue"
                  mt={2}
                  borderRadius="md"
                />
              )}
            </Box>
          </Flex>
          <Text fontSize="xs" color="gray.500" pl="104px">
            <Icon as={FaImage} mr={1} />
            Upload a profile picture (optional)
          </Text>
        </Flex>
      </FormControl>

      <Button
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
        isLoading={loading}
      >
        Create Account
      </Button>
    </VStack>
  );
};

export default SignUp;
