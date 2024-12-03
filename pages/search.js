import { Button, Container, Heading, Input, Box } from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";
import { useEffect, useState } from "react";
import { Link } from "@chakra-ui/react";

export default function Search() {
  const [inputValue, setInputValue] = useState("");
  const [listItems, setListItems] = useState([]);
  const listStyle = {
    listStyleType: "circle",
    borderWidth: "1px",
    listStylePosition: "inside",
    p: "10px",
    w: "524px",
    m: "100px",
    bg: "purple.300",
    rounded: "md",
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}&count=1&language=en&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.results) {
          return alert(
            "Incorect city name. Please check spelling and try again!"
          );
        }
        setListItems([data.results[0]]);
      });
    setInputValue("");
  };

  useEffect(() => {
    fetch("../api/favorites").then((res) => res.json());
  }, []);

  return (
    <Box bgColor="purple.50" h="100vh">
      <MenuBar />
      <Container p="20px" centerContent="true">
        <Heading size="3xl" mb="7">
          Search Page
        </Heading>

        <form onSubmit={(e) => handleSubmit(e)}>
          <label>City name</label>
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            placeholder="City name"
            w="350px"
            ml="3"
            _hover={{ borderColor: "purple.500", borderWidth: "3px" }}
          />
          <Button ml="3" _hover={{ bg: "purple.500" }} type="submit">
            Submit
          </Button>
        </form>
        {listItems.length > 0 &&
          listItems.map((city) => {
            return (
              <Box as="ul" css={listStyle} key={city.name}>
                <li>City: {city.name}</li>
                <br></br>
                <li>Country: {city.country}</li>
                <br></br>
                <li>Latitude: {city.latitude}</li>
                <br></br>
                <li>Longitude: {city.longitude}</li>
                <br></br>
                <li>Population: {city.population}</li>
                <br></br>
                <li>
                  <Link
                    _hover={{ color: "white" }}
                    variant="underline"
                    href={`./cities/${city.name}`}
                  >
                    See more details about this city!
                  </Link>
                </li>
              </Box>
            );
          })}
      </Container>
    </Box>
  );
}
