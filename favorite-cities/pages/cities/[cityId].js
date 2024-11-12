import { Container, Heading, Text, Box } from "@chakra-ui/react";
import MenuBar from "@/components/menuBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function City() {
  const router = useRouter();
  const cityId = router.query.cityId;

  const [listItems, setListItems] = useState([]);
  const [extraItems, setExtraItems] = useState([]);
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
    const localValue = localStorage.getItem("cities");
    if (localValue === null) return;
    const savedItems = JSON.parse(localValue);

    savedItems.map((item) => {
      if (item.city === cityId) {
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${item.latitude}&longitude=${item.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (extraItems.length === 0) {
              setExtraItems(Array(data));
            }
          });

        if (listItems.length === 0) {
          setListItems(Array(item));
        }
      }
    });
  });

  return (
    <>
      <MenuBar />
      <Container p="20px" centerContent="true">
        <Heading size="3xl">{cityId}</Heading>
        {listItems.length > 0 &&
          listItems.map((item) => {
            return (
              <Box as="ul" css={listStyle} key={item.city}>
                <li>City: {item.city}</li>
                <li>Country: {item.country}</li>
                <li>Latitude: {item.latitude}</li>
                <li>Longitude: {item.longitude}</li>
                <li>Population: {item.population}</li>
              </Box>
            );
          })}
        {extraItems.length > 0 &&
          extraItems.map((extraItem) => {
            return (
              <Box as="ul" css={listStyle} key={extraItem.latitude}>
                <li>
                  Max temperature: {extraItem.daily.temperature_2m_max} {extraItem.daily_units.temperature_2m_max}
                </li>
                <li>
                  Min temperature: {extraItem.daily.temperature_2m_min} {extraItem.daily_units.temperature_2m_max}
                </li>
                <li>
                  Date: {extraItem.daily.time}
                </li>
              </Box>
            );
          })}
      </Container>
    </>
  );
}
