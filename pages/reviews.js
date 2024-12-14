import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Flex,
  Center,
  Stack,
  HStack,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { Rating } from "@/components/ui/rating";
import MenuBar from "@/components/menuBar";

export default function Reviews() {
  const [fetchedTestimonials, setFetchedTestimonials] = useState([]);
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
    fetch("../api/rating")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFetchedTestimonials(data);
      });
  }, []);
  console.log(fetchedTestimonials);

  return (
    <>
      <Box bgColor="purple.50" h="100vh">
        <MenuBar />
        <Container p="20px" centerContent="true">
          <Heading mb="55px" size="3xl">
            Reviews
          </Heading>
          <Flex gap="7" wrap="wrap">
            {fetchedTestimonials.length > 0 &&
              fetchedTestimonials.map((testimonial) => {
                return (
                  <Box
                    as="ul"
                    css={listStyle}
                    key={testimonial.cityName}
                    className="cityBox"
                  >
                    <Center m="10px">
                      {testimonial.cityName}, {testimonial.country}
                    </Center>
                    <Center mb="10px">
                      <Rating
                        colorPalette="orange"
                        readOnly
                        size="lg"
                        defaultValue={Number(testimonial.rating)}
                      />
                    </Center>
                    <Center mb="10px">
                      <Text>"{testimonial.review}"</Text>
                    </Center>
                  </Box>
                );
              })}
          </Flex>
        </Container>
      </Box>
    </>
  );
}
