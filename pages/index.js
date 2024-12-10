import { useSession, signIn, signOut } from "next-auth/react";
import {
  Button,
  Container,
  Heading,
  Text,
  Flex,
  Box,
  Center,
  Link,
} from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";
import { useEffect, useState } from "react";
import Head from "next/head";
import someImage from "../public/images/city.jpg";

export default function Home({ cities }) {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [randomCities, setRandomCities] = useState([]);
  const [fetchedRandomCity, setFetchedRandomCity] = useState([]);
  const [noFavoriteCitiesText, setNoFavoriteCitiesText] = useState("");
  const [weatherItems, setWeatherIems] = useState([]);
  const [fetchedCities, setFetchedCities] = useState([]);
  const [buttonText, setButtonText] = useState("Add to favorites💜");
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const { data: session } = useSession();

  const listStyle = {
    borderWidth: "1px",
    p: "10px",
    w: "524px",
    m: "25px",
    bg: "purple.300",
    rounded: "md",
  };
  const backgroundImgStyle = {
    backgroundImage: `url(${someImage.src})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",

    alignItems: "center",
    justifyContent: "center",
  };

  useEffect(() => {
    if (favoriteCities.length === 0) {
      fetch("./api/favorites")
        .then((res) => res.json())
        .then((data) => {
          if (data.length == 0) {
            setNoFavoriteCitiesText("No favorite cities added yet!");
          }
          if (data.length > 5) {
            const slicedArray = data.slice(0, 5);
            setFavoriteCities([slicedArray]);
          } else setFavoriteCities([data]);
        });
    }
  }, []);

  useEffect(() => {
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=1&language=en&format=json`
    ).then((res) => res.json());
  });

  useEffect(() => {
    setRandomCities(Object.values(cities));
  }, []);

  useEffect(() => {
    if (randomCities.length > 0) {
      const random = randomCities
        .sort(() => {
          return Math.random() - 0.5;
        })
        .slice(0, 5);
      random.map((city) => [
        fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            setFetchedRandomCity((currentItem) => {
              return [...currentItem, data.results[0]];
            });
          }),
      ]);
    }
  }, [randomCities]);

  function successCallback(position) {
    fetch(
      `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${position.coords.longitude}&latitude=${position.coords.latitude}&access_token=pk.eyJ1IjoiYWRyaWFuYS1zcHJpbmNlYW4iLCJhIjoiY200OXc0dGpmMDFiOTJpc2U4OGE5OTVsdSJ9.MDVI_4ila-QC7Hsbj2BacA`
    )
      .then((res) => res.json())
      .then((data) => {
        fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${data.features[0].properties.context.place.name}&count=1&language=en&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            setCityName(data.results[0].name);
            setCountryName(data.results[0].country);
          });
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
        )
          .then((res) => res.json())
          .then((data) => {
            setWeatherIems([data]);
          });
      });
  }

  function errorCallback(error) {
    fetch("https://ipinfo.io/json?token=333cb3549b21d1")
      .then((response) => response.json())
      .then((data) => {
        fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${data.city}&count=1&language=en&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            setCityName(data.results[0].name);
            setCountryName(data.results[0].country);
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${data.results[0].latitude}&longitude=${data.results[0].longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
            )
              .then((res) => res.json())
              .then((data) => {
                setWeatherIems([data]);
              });
          });
      });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  useEffect(() => {
    fetchedCities.map((dbData) => {
      dbData.map((dbCities) => {
        if (
          cityName === dbCities.cityName &&
          countryName === dbCities.country
        ) {
          setButtonText("Remove from favorites");
        }
      });
    });
  }, [fetchedCities, cityName]);

  useEffect(() => {
    fetch("../api/favorites")
      .then((res) => res.json())
      .then((data) => {
        setFetchedCities([data]);
      });
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    fetch("../api/favorites", {
      method: "POST",
      body: JSON.stringify({ cityName: cityName, country: countryName }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    buttonText === "Add to favorites💜"
      ? setButtonText("Remove from favorites")
      : setButtonText("Add to favorites💜");
  };

  if (!session) {
    return (
      <Center>
        <Box mt="300px">
          <Text w="100px" mb="20px">
            Not signed in
          </Text>
          <Button onClick={() => signIn()} bg="purple.500" w="100px">
            Sign in
          </Button>
        </Box>
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex
        bgColor="purple.50"
        justify="space-between"
        align="center"
        height="70px"
      >
        <MenuBar />
        <Box m="10" justifyItems="center" h="36px">
          <Text>Signed in as {session.user.email}</Text>
          <Button onClick={() => signOut()} h="25px">
            Sign out
          </Button>
        </Box>
      </Flex>
      <Box css={backgroundImgStyle}>
        <Container centerContent="true">
          <Box p="5px" rounded="md" mb="55px" bgColor="purple.900/80">
            <Text color="white" textStyle="3xl" fontWeight="bold">
              Welcome to favorite cities website!
              <br />
            </Text>
          </Box>
          <Text mt="3.5" css={listStyle} textStyle="lg" fontWeight="medium">
            In order to explore the cities of the world{" "}
            <Link
              _hover={{ color: "white" }}
              variant="underline"
              color="purple.700"
              href="/search"
            >
              search here
            </Link>
            !
          </Text>
          <Flex wrap="wrap" gap="100px">
            <Box css={listStyle}>
              <Center>
                <Heading size="xl">Favorite cities 💜</Heading>
              </Center>
              <Center>
                <Text>{noFavoriteCitiesText}</Text>
              </Center>
              {favoriteCities.length > 0 &&
                favoriteCities[0].map((city) => {
                  return (
                    <Center key={city.cityName}>
                      <Box as="ul">
                        <li>
                          City: {city.cityName} | Country: {city.country}
                        </li>
                        <br></br>
                      </Box>
                    </Center>
                  );
                })}
            </Box>
            <Box css={listStyle}>
              <Center>
                <Heading size="xl">Random cities </Heading>
              </Center>
              {fetchedRandomCity.length > 0 &&
                fetchedRandomCity.map((city) => {
                  return (
                    <Center key={city.name}>
                      <Box as="ul">
                        <li>
                          City: {city.name} | Country: {city.country} |
                          Population: {city.population}
                        </li>
                        <br></br>
                      </Box>
                    </Center>
                  );
                })}
            </Box>
          </Flex>
          {weatherItems.length > 0 &&
            weatherItems.map((city) => {
              return (
                <Box css={listStyle}>
                  <Center>
                    You are in {cityName} from {countryName}
                  </Center>
                  <br></br>
                  <Center>
                    <Text>
                      Max temperature: {city.daily.temperature_2m_max}{" "}
                      {city.daily_units.temperature_2m_max}
                    </Text>
                  </Center>
                  <Center>
                    <Text>
                      Min temperature: {city.daily.temperature_2m_min}{" "}
                      {city.daily_units.temperature_2m_max}
                    </Text>
                  </Center>
                  <Center>
                    <Text>Date: {city.daily.time}</Text>
                  </Center>
                  <br></br>
                  <Center>
                    <Button onClick={(e) => handleClick(e)}>
                      {buttonText}
                    </Button>
                  </Center>
                </Box>
              );
            })}
        </Container>
      </Box>
    </>
  );
}

export async function getServerSideProps() {
  const response = await fetch("http://localhost:4000/cities");
  const data = await response.json();

  return {
    props: {
      cities: data,
    },
  };
}
