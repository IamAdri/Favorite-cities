import { Container, Heading, Box, Center, Flex } from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";
import { useState, useEffect } from "react";

export default function Favorites() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const listStyle = {
    listStyleType: "circle",
    borderWidth: "1px",
    listStylePosition: "inside",
    p: "10px",
    w: "224px",
    m: "35px",
    bg: "purple.300",
    rounded: "md",
  };

  useEffect(() => {
    if (favoriteCities.length === 0) {
      fetch("./api/favorites")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setFavoriteCities([data]);
        });
    }
  });

  return (
    <Box bgColor="purple.50" h="100vh">
      <MenuBar />
      <Container p="20px" centerContent="true">
        <Heading mb="55px" size="3xl">
          Favorites Page💜💜💜
        </Heading>
        <Flex gap="7" wrap="wrap">
          {favoriteCities.length > 0 &&
            favoriteCities[0].map((city) => {
              return (
                <Box
                  as="ul"
                  css={listStyle}
                  key={city.cityName}
                  className="cityBox"
                >
                  <Center>City: {city.cityName}</Center>
                  <Center>Country: {city.country}</Center>
                </Box>
              );
            })}
        </Flex>
      </Container>
    </Box>
  );
}
