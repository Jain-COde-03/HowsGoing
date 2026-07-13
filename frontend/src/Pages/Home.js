/* eslint-disable no-unused-vars */
import {
  Container,
  Box,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FaComments, FaUserFriends } from "react-icons/fa";
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
    <Container
<<<<<<< HEAD
      maxW="100%"
      centerContent
      minH="100vh"
      py={8}
      px={4}
      overflow="hidden"
    >
      <HStack
        spacing={8}
        w="100%"
        h="auto"
=======
      minW = "100vw"
      centerContent
      minH="100vh"
      overflow="hidden"
    >
      <HStack
        w="100%"
        h="100%"
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)
        alignItems="center"
        justifyContent="center"
        wrap="wrap"
      >
        {/* Logo/Brand Section */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
<<<<<<< HEAD
=======
          margin={0}
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)
          p={8}
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          borderRadius="3xl"
          boxShadow="2xl"
          flex="1"
<<<<<<< HEAD
          minW="280px"
          maxW="sm"
          minH="580px"
=======
          minW="39.4%"
          maxW="sm"
          minH="95%"
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            bg: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          }}
        >
          <Icon as={FaComments} w={16} h={16} color="white" mb={4} />
          <Text
            fontSize="4xl"
            fontFamily="Work Sans"
            fontWeight="900"
            color="white"
            textAlign="center"
            letterSpacing="wider"
            textShadow="2px 2px 4px rgba(0,0,0,0.3)"
          >
            HowsGoing?
          </Text>
          <Text
            fontSize="lg"
            color="whiteAlpha.900"
            textAlign="center"
            mt={2}
            fontWeight="500"
          >
            Connect, Chat, Share Moments
          </Text>
        </Box>

        {/* Auth Forms */}
        <Box
          bg="white"
<<<<<<< HEAD
          borderRadius="3xl"
          boxShadow="2xl"
          flex="1"
          minW="320px"
=======
          margin={0}
          borderRadius="3xl"
          boxShadow="2xl"
          flex="1"
          minW="60%"
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)
          maxW="md"
          p={8}
          border="1px solid"
          borderColor="gray.100"
          position="relative"
<<<<<<< HEAD
          minH="580px"
          h="100%"
          maxH="85vh"
=======
          minH="95%"
>>>>>>> d219629 (feat: Implement chat functionality with AI integration and user management)
          overflowY="auto"
        >
          <Tabs isFitted variant="soft-rounded" colorScheme="purple">
            <TabList mb={8} bg="gray.50" p={1} borderRadius="2xl">
              <Tab
                _selected={{
                  bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  boxShadow: "md",
                }}
                borderRadius="xl"
                fontWeight="600"
                fontSize="md"
                py={3}
                transition="all 0.3s"
              >
                <Icon as={FaUserFriends} mr={2} />
                Login
              </Tab>
              <Tab
                _selected={{
                  bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  boxShadow: "md",
                }}
                borderRadius="xl"
                fontWeight="600"
                fontSize="md"
                py={3}
                transition="all 0.3s"
              >
                <Icon as={FaComments} mr={2} />
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
      </HStack>
    </Container>
  );
};

export default Home;
