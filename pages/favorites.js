import { Container, Heading, Text } from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";

export default function Favorites() {
  return (
    <>
    <MenuBar />
      <Container p="20px" centerContent="true">
        <Heading size="3xl">Favorites Page</Heading>
        <Text mt="3.5" bg="purple.500" color="white">This is the favorites page</Text>
      </Container>
    </>
      
  );
}