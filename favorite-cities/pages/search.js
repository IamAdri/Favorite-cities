import { Button, Container, Heading, Input, Box } from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";
import { useEffect, useState } from "react";
import { Link } from "@chakra-ui/react";

export default function Search({ data }) {
  const [inputValue, setInputValue] = useState("");
  const [listItems, setListItems] = useState([]);

  const listStyle = {
    listStyleType: "circle",
    borderWidth: "1px",
    listStylePosition: "inside",
    p: "10px",
    w: "524px",
    m: "35px",
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
        //console.log(data.results)
      if(!data.reults) return alert("Incorect city name. Please check spelling and try again.")
        setListItems((currentList) => {
          return [
            ...currentList,
            {
              city: data.results[0].name,
              country: data.results[0].country,
              latitude: data.results[0].latitude,
              longitude: data.results[0].longitude,
              population: data.results[0].population,
            },
          ];
        });
        //console.log(data.results[0])
      })
      .catch(error => alert((error)))

    setInputValue("");
  };

  useEffect(() => {
    if (listItems.length > 0) {
      localStorage.setItem("cities", JSON.stringify(listItems));
    }

    console.log(listItems);
  }, [listItems]);

  useEffect(() => {
    const localValue = localStorage.getItem("cities");
    if (localValue === null) return;
    const savedItems = JSON.parse(localValue);
    setListItems(savedItems);
  }, []);
  return (
    <>
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

        {listItems.map((item) => {
          return (
            <Box as="ul" css={listStyle} key={item.city}>
              <li>City: {item.city}</li>
              <li>Country: {item.country}</li>
              <li>Latitude: {item.latitude}</li>
              <li>Longitude: {item.longitude}</li>
              <li>Population: {item.population}</li>
              <li>
                <Link variant="underline" href={`./cities/${item.city}`}>
                  Link
                </Link>
              </li>
            </Box>
          );
        })}
      </Container>
    </>
  );
}
