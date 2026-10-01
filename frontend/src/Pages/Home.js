/* eslint-disable no-unused-vars */
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  VStack,
  Icon,
  Flex,
  Badge,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FaWhatsapp, FaShieldAlt, FaBolt, FaRobot, FaUsers } from "react-icons/fa";
import { IoCheckmarkDone } from "react-icons/io5";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useHistory } from "react-router-dom";

const Home = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Box
      minH="100vh"
      w="100vw"
      bg="#d1d7db"
      position="relative"
      display="flex"
      flexDir="column"
      overflowY="auto"
    >
      {/* WhatsApp Web Green Header Strip */}
      <Box
        h={{ base: "130px", md: "220px" }}
        bg="#00a884"
        w="100%"
        position="absolute"
        top="0"
        left="0"
        zIndex="0"
        px={{ base: 6, md: 16 }}
        py={6}
      >
        <Flex align="center" gap={3} maxW="1200px" mx="auto">
          <Icon as={FaWhatsapp} w={8} h={8} color="white" />
          <Text
            color="white"
            fontSize="sm"
            fontWeight="700"
            letterSpacing="1.5px"
            textTransform="uppercase"
          >
            HowsGoing Web
          </Text>
        </Flex>
      </Box>

      {/* Main Content Floating Card */}
      <Container
        maxW="1100px"
        position="relative"
        zIndex="1"
        pt={{ base: "70px", md: "80px" }}
        pb={10}
        px={{ base: 4, md: 6 }}
      >
        <Box
          bg="white"
          borderRadius="12px"
          boxShadow="0 17px 50px 0 rgba(11,20,26,.12), 0 12px 15px 0 rgba(11,20,26,.1)"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          <Flex
            direction={{ base: "column", lg: "row" }}
            minH={{ md: "620px" }}
          >
            {/* Left Column: WhatsApp Instructions & Features */}
            <Box
              flex="1"
              p={{ base: 6, md: 10 }}
              bg="#fcfdfd"
              borderRight={{ lg: "1px solid" }}
              borderColor={{ lg: "#e9edef" }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box>
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="300"
                  color="#41525d"
                  fontFamily="'Segoe UI', 'Inter', sans-serif"
                  lineHeight="1.3"
                  mb={4}
                >
                  Use HowsGoing on your computer
                </Text>

                <VStack align="flex-start" spacing={4} mt={6} color="#3b4a54">
                  <Flex align="flex-start" gap={3}>
                    <Text
                      fontWeight="600"
                      color="#00a884"
                      fontSize="md"
                      w="20px"
                    >
                      1.
                    </Text>
                    <Text fontSize="15px">
                      Sign in to your account or jump right in using <b>Continue as Guest</b>.
                    </Text>
                  </Flex>

                  <Flex align="flex-start" gap={3}>
                    <Text
                      fontWeight="600"
                      color="#00a884"
                      fontSize="md"
                      w="20px"
                    >
                      2.
                    </Text>
                    <Text fontSize="15px">
                      Start real-time 1-on-1 chats, organize group discussions, or ask the built-in <b>Gemini AI</b> anything.
                    </Text>
                  </Flex>

                  <Flex align="flex-start" gap={3}>
                    <Text
                      fontWeight="600"
                      color="#00a884"
                      fontSize="md"
                      w="20px"
                    >
                      3.
                    </Text>
                    <Text fontSize="15px">
                      Enjoy typing indicators, instant notifications, and clean WhatsApp-style messaging.
                    </Text>
                  </Flex>
                </VStack>

                {/* Feature Tags */}
                <Box mt={8} pt={6} borderTop="1px solid #f0f2f5">
                  <Text fontSize="xs" fontWeight="700" color="#8696a0" textTransform="uppercase" letterSpacing="0.8px" mb={3}>
                    Highlighted Features
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    <Badge
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      bg="#e7fce3"
                      color="#008069"
                      fontSize="xs"
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      textTransform="none"
                    >
                      <Icon as={FaBolt} /> Realtime Sockets
                    </Badge>
                    <Badge
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      bg="#eef2ff"
                      color="#4f46e5"
                      fontSize="xs"
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      textTransform="none"
                    >
                      <Icon as={FaRobot} /> AI Assistant
                    </Badge>
                    <Badge
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      bg="#f0fdf4"
                      color="#15803d"
                      fontSize="xs"
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      textTransform="none"
                    >
                      <Icon as={FaUsers} /> Group Chats
                    </Badge>
                    <Badge
                      px={3}
                      py={1.5}
                      borderRadius="full"
                      bg="#f8fafc"
                      color="#475569"
                      fontSize="xs"
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      textTransform="none"
                    >
                      <Icon as={IoCheckmarkDone} color="#53bdeb" /> Read Receipts
                    </Badge>
                  </Flex>
                </Box>
              </Box>

              {/* End-to-end encryption note */}
              <Flex align="center" gap={2} mt={8} color="#8696a0" fontSize="xs">
                <Icon as={FaShieldAlt} color="#008069" />
                <Text>End-to-end encrypted messaging experience</Text>
              </Flex>
            </Box>

            {/* Right Column: Auth Tabs & Form */}
            <Box
              flex="1.1"
              p={{ base: 6, md: 8 }}
              bg="white"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Tabs isFitted variant="unstyled">
                <TabList
                  mb={6}
                  bg="#f0f2f5"
                  p="4px"
                  borderRadius="10px"
                  border="1px solid #e9edef"
                >
                  <Tab
                    borderRadius="8px"
                    py={2.5}
                    fontWeight="600"
                    fontSize="sm"
                    color="#54656f"
                    _selected={{
                      bg: "#ffffff",
                      color: "#008069",
                      boxShadow: "0 1px 3px rgba(11,20,26,0.12)",
                    }}
                    transition="all 0.2s"
                  >
                    Log In
                  </Tab>
                  <Tab
                    borderRadius="8px"
                    py={2.5}
                    fontWeight="600"
                    fontSize="sm"
                    color="#54656f"
                    _selected={{
                      bg: "#ffffff",
                      color: "#008069",
                      boxShadow: "0 1px 3px rgba(11,20,26,0.12)",
                    }}
                    transition="all 0.2s"
                  >
                    Sign Up
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel p={0}>
                    <Login />
                  </TabPanel>
                  <TabPanel p={0}>
                    <SignUp />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>
        </Box>

        {/* Footer info */}
        <Flex justify="center" align="center" gap={2} mt={6} color="#8696a0" fontSize="xs">
          <Icon as={FaShieldAlt} />
          <Text>HowsGoing Web • Built with React & Chakra UI</Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Home;

