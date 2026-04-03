import React from 'react'
import { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button , useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
      const toast = useToast();
      const[email, setEmail] = useState("")
      const[password, setPassword] = useState("")
      const[show, setShow] = useState(false)
      const[loading, setLoading] = useState(false)
      const history = useHistory();

    const submitHandler = async () => {
        setLoading(true);
        if(!email || !password){
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

        try{
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };

          const { data } = await axios.post(
            "/api/users/login",
            { email, password },
            config
          );
          toast({
            title: "Login Successful",
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
      }

    return (
        <VStack spacing="5px">
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

          <Button isLoading={loading} onClick={submitHandler} colorScheme="blue" width="100%" style={{ marginTop: 15 }}>
            Login
          </Button>

          <Button 
          onClick={()=>{
            setEmail("guest123@example.com") ;
            setPassword("guest123");
          }}
          variant="solid" colorScheme="red" width="100%" style={{ marginTop: 15 }}>
            Get Guest User Credentials
          </Button>
        </VStack>
      );
}

export default Login

