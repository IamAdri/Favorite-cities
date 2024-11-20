import { Container, Heading, Text } from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";

export default function City() {
  return (
    <>
    <MenuBar />
      <Container p="20px" centerContent="true">
        <Heading size="3xl">City Page</Heading>
        <Text mt="3.5" bg="purple.500" color="white">This is the city page</Text>
      </Container>
    </>
      
  );
}