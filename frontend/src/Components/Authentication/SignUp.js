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
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";

const SignUp = () => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
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

    if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chat-App");
      data.append("cloud_name", "dzqiwkcet");
      fetch("https://api.cloudinary.com/v1_1/dzqiwkcet/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
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

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel color="white">Name</FormLabel>
        <Input
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
          placeholder="Name"
          textColor="white"
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel color="white">Email</FormLabel>
        <Input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          placeholder="Email"
          textColor="white"
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel color="white">Password</FormLabel>
        <InputGroup>
          <Input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type={show ? "text" : "password"}
            placeholder="Password"
            textColor="white"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel color="white">Confirm Password</FormLabel>
        <InputGroup>
          <Input
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            value={confirmPassword}
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            textColor="white"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel color="white">Upload your Picture</FormLabel>
        <Input
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
          type="file"
          p={1.5}
          accept="image/*"
          textColor="white"
        />
      </FormControl>

      <Button
        onClick={submitHandler}
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
