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
} from "@chakra-ui/react";
import React , {useEffect} from "react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useHistory } from "react-router-dom";

const Home = () => {

  const history = useHistory() ;
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo")) ;
  
      if(user){
          history.push("/chats") ;
      }
    }, [history])

  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          p={3}
          bg={useColorModeValue("whiteAlpha.300", "blackAlpha.300")}
          backdropFilter="blur(0px) saturate(100%)"
          borderRadius="20px"
          border="1px solid"
          borderColor={useColorModeValue("whiteAlpha.300", "whiteAlpha.100")}
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          w="100%"
          m="40px 0 15px 0"
          textAlign="center"
          textColor="White"
        >
          <Text fontSize="2xl" fontFamily="Work Sans" fontWeight="bold">
            HowsGoing?
          </Text>
        </Box>

        <Box
          bg={useColorModeValue("whiteAlpha.300", "blackAlpha.300")}
          backdropFilter="blur(0px) saturate(100%)"
          borderRadius="20px"
          border="1px solid"
          borderColor={useColorModeValue("whiteAlpha.300", "whiteAlpha.100")}
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
          width="100%"
          p={4}
          textColor="black"
        >
          <Tabs isFitted variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab color="white" fontSize="xl">
                Login
              </Tab>
              <Tab color="white" fontSize="xl">
                Sign Up
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {<Login/>}
              </TabPanel>
              <TabPanel>
                {<SignUp />}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Home;
