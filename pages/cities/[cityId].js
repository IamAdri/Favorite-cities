import { Container, Heading, Box, Button } from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function City() {
  const router = useRouter();
  const cityId = router.query.cityId;
  const [listItems, setListItems] = useState([]);
  const [weatherItems, setWeatherIems] = useState([]);
  const [buttonText, setButtonText] = useState("Add to favorites💜");
  const [fetchedCities, setFetchedCities] = useState([]);

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

  useEffect(() => {
    if (listItems.length === 0) {
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityId}&count=1&language=en&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.results) return;
          setListItems([data.results[0]]);
        });
    }
  });

  useEffect(() => {
    listItems.map((city) => {
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
      )
        .then((res) => res.json())
        .then((data) => {
          setWeatherIems([data]);
        });
    });
  }, [listItems]);

  const buttonTextValue = () => {
    fetchedCities.map((dbData) => {
      dbData.map((dbCities) => {
        listItems.map((fetchedLocation) => {
          if (
            fetchedLocation.name === dbCities.cityName &&
            fetchedLocation.country === dbCities.country
          ) {
            setButtonText("Remove from favorites");
          }
        });
      });
    });
  };

  useEffect(() => {
    fetch("../api/favorites")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFetchedCities([data]);
      });
    buttonTextValue();
  }, [listItems]);

  const handleClick = (e) => {
    e.preventDefault();
    listItems.map((city) => {
      fetch("../api/favorites", {
        method: "POST",
        body: JSON.stringify({ cityName: city.name, country: city.country }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    });
    buttonText === "Add to favorites💜"
      ? setButtonText("Remove from favorites")
      : setButtonText("Add to favorites💜");
  };

  return (
    <Box bgColor="purple.50" h="100vh">
      <MenuBar />
      <Container p="20px" centerContent="true">
        <Heading size="3xl">{cityId}</Heading>
        {listItems.length > 0 &&
          listItems.map((city) => {
            return (
              <Box as="ul" css={listStyle} key={city.name} className="cityBox">
                <li>City: {city.name}</li>
                <li>Country: {city.country}</li>
                <li>Latitude: {city.latitude}</li>
                <li>Longitude: {city.longitude}</li>
                <li>Population: {city.population}</li>
              </Box>
            );
          })}
        {weatherItems.length > 0 &&
          weatherItems.map((city) => {
            return (
              <Box as="ul" css={listStyle} key={city.latitude}>
                <li>
                  Max temperature: {city.daily.temperature_2m_max}{" "}
                  {city.daily_units.temperature_2m_max}
                </li>
                <li>
                  Min temperature: {city.daily.temperature_2m_min}{" "}
                  {city.daily_units.temperature_2m_max}
                </li>
                <li>Date: {city.daily.time}</li>
              </Box>
            );
          })}
        {weatherItems.length > 0 && (
          <Button onClick={(e) => handleClick(e)}>{buttonText}</Button>
        )}
      </Container>
    </Box>
  );
}
