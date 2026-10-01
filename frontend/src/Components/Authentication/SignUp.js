/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
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
  FaCamera,
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
  const { setUser } = ChatState();

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
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
          setPic(data.url.toString());
          setUploadProgress(100);
          setTimeout(() => setUploadProgress(0), 800);
          setLoading(false);
          toast({
            title: "Profile photo uploaded",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setUploadProgress(0);
        });
    } else {
      toast({
        title: "Please select a valid image (JPEG/PNG)",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
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
        "/api/users",
        { name, email, password, pic },
        config,
      );

      toast({
        title: "Account Created Successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <VStack spacing={3.5} w="100%" align="stretch">
      <Box mb={1}>
        <Text fontSize="xl" fontWeight="600" color="#111b21">
          Create Account
        </Text>
        <Text fontSize="sm" color="#667781">
          Start messaging with your contacts today
        </Text>
      </Box>

      <FormControl id="name" isRequired>
        <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1}>
          Full Name
        </FormLabel>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaUser} color="#8696a0" />
          </InputLeftElement>
          <Input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="John Doe"
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

      <FormControl id="email-signup" isRequired>
        <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1}>
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

      <FormControl id="password-signup" isRequired>
        <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1}>
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
            placeholder="Create password"
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
        {password && (
          <Box mt={1.5}>
            <Progress
              value={(passwordStrength / 5) * 100}
              size="xs"
              colorScheme={
                passwordStrength < 3
                  ? "red"
                  : passwordStrength < 4
                    ? "yellow"
                    : "green"
              }
              borderRadius="full"
            />
          </Box>
        )}
      </FormControl>

      <FormControl id="confirm-password-signup" isRequired>
        <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1}>
          Confirm Password
        </FormLabel>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Icon
              as={passwordsMatch ? FaCheck : FaTimes}
              color={passwordsMatch ? "#00a884" : "#8696a0"}
            />
          </InputLeftElement>
          <Input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            bg="#f0f2f5"
            border="1px solid transparent"
            _hover={{ bg: "#e9edef" }}
            _focus={{
              borderColor: passwordsMatch ? "#00a884" : "red.400",
              bg: "#ffffff",
              boxShadow: `0 0 0 1px ${passwordsMatch ? "#00a884" : "#e53e3e"}`,
            }}
            borderRadius="8px"
            fontSize="sm"
            color="#111b21"
          />
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel fontSize="xs" fontWeight="600" color="#54656f" mb={1}>
          Profile Picture <span style={{ fontWeight: "normal", color: "#8696a0" }}>(Optional)</span>
        </FormLabel>
        <Input
          onChange={(e) => postDetails(e.target.files[0])}
          type="file"
          p={1}
          accept="image/*"
          bg="#f0f2f5"
          border="1px dashed #cbd5e0"
          borderRadius="8px"
          fontSize="xs"
          sx={{
            "::file-selector-button": {
              border: "none",
              bg: "#e9edef",
              color: "#111b21",
              borderRadius: "6px",
              padding: "3px 10px",
              marginRight: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "xs",
            },
          }}
        />
        {uploadProgress > 0 && (
          <Progress
            value={uploadProgress}
            size="xs"
            colorScheme="green"
            mt={1.5}
            borderRadius="full"
          />
        )}
      </FormControl>

      <Button
        onClick={submitHandler}
        bg="#008069"
        color="white"
        width="100%"
        size="md"
        borderRadius="8px"
        fontWeight="600"
        fontSize="sm"
        _hover={{ bg: "#00a884" }}
        _active={{ bg: "#075e54" }}
        mt={2}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;

