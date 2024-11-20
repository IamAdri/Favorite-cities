import { Button, Container, Heading, Input, Box } from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";
import { useEffect, useState } from "react";
import { Link } from "@chakra-ui/react";

export default function Search({ data }) {
  const [inputValue, setInputValue] = useState("");
  const [listItems, setListItems] = useState([]);
  const [cityName, setCityName] = useState([]);

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
        if (!data.results)
          return alert(
            "Incorect city name. Please check spelling and try again!"
          );
        if (cityName.includes(inputValue))
          return alert("This city is included in the list already!");
        setCityName((currentList) => {
          return [...currentList, data.results[0].name];
        });
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
      })
      .catch((error) => alert(error));
    setInputValue("");
  };

  useEffect(() => {
    if (listItems.length > 0) {
      localStorage.setItem("cities", JSON.stringify(listItems));
    }
  }, [listItems]);

  useEffect(() => {
    if (cityName.length > 0) {
      localStorage.setItem("names", JSON.stringify(cityName));
    }
  }, [cityName]);

  useEffect(() => {
    const localValue = localStorage.getItem("cities");
    const localValueOfName = localStorage.getItem("names");
    if (localValue === null) return;
    if (localValueOfName === null) return;
    const savedItems = JSON.parse(localValue);
    const savedNames = JSON.parse(localValueOfName);
    setListItems(savedItems);
    setCityName(savedNames);
  }, []);

  const handleDelete = (e, item) => {
    const parentEl = e.target.closest(".cityBox");
    parentEl.style.display = "none";
    const index = listItems.indexOf(item);
    const indexCity = cityName.indexOf(item.city);
    listItems.splice(index, 1);
    cityName.splice(indexCity, 1);
    localStorage.setItem("cities", JSON.stringify(listItems));
    localStorage.setItem("names", JSON.stringify(cityName));
  };

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
            <Box as="ul" css={listStyle} key={item.city} className="cityBox">
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

              <Button mt="3" h="25px" w="55px" bg="blackAlpha.700"
                onClick={(e) => {
                  handleDelete(e, item);
                }}
              >
                Delete
              </Button>
            </Box>
          );
        })}
      </Container>
    </>
  );
}
