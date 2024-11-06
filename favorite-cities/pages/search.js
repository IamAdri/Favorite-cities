import { Container, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

export default function Search() {
  return (
    <>
      <MenuRoot>
        <MenuTrigger asChild>
          <Button
            size="sm"
            variant="solid"
            colorPalette="purple"
            _hover={{ color: "colorPallete.800" }}
          >
            Menu bar
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem asChild value="homepage" _hover={{ bg: "purple.800" }}>
            <Link href="/">Home page</Link>
          </MenuItem>
          <MenuItem asChild value="city-page" _hover={{ bg: "purple.800" }}>
            <Link href="/city-page">City page</Link>
          </MenuItem>
          <MenuItem asChild value="favorites" _hover={{ bg: "purple.800" }}>
            <Link href="/favorites">Favorites</Link>
          </MenuItem>
        </MenuContent>
      </MenuRoot>
      <Container p="20px">
        <Heading size="3xl">Search Page</Heading>
        <Text mt="3.5" bg="purple.500">
          This is the search page
        </Text>
      </Container>
    </>
  );
}
