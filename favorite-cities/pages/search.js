import { Container, Heading, Text } from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";

export default function Search() {
  return (
    <>
      <MenuBar />
      <Container p="20px">
        <Heading size="3xl">Search Page</Heading>
        <Text mt="3.5" bg="purple.500" color="white">
          This is the search page
        </Text>
      </Container>
    </>
  );
}
