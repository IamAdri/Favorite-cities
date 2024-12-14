import React from "react";
import { FacebookShareButton, FacebookIcon, WhatsappIcon, WhatsappShareButton, LinkedinShareButton, LinkedinIcon } from "next-share";

import {
  Container,
  Heading,
  Box,
  Button,
  Stack,
  Flex,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/ui/field";
import { Rating } from "@/components/ui/rating";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import MenuBar from "@/components/menuBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";


const formSchema = z.object({
  rating: z.number({ required_error: "Rating is required" }).min(1).max(5),
});

export default function City() {
  const router = useRouter();
  const cityId = router.query.cityId;
  const [listItems, setListItems] = useState([]);
  const [weatherItems, setWeatherIems] = useState([]);
  const [buttonText, setButtonText] = useState("Add to favorites💜");
  const [fetchedCities, setFetchedCities] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [ratingStar, setRatingStar] = useState("");
  const [reviewButtonText, setReviewButtonText] = useState("Submit");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fetchedTestimonials, setFetchedTestimonials] = useState([]);
  const [existingTestimonial, setExistingTestimonial] = useState("");

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
//Fetch api with data about city
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
//Fetch api with weather data in this city
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
//Check if city is added already in favorites
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
        setFetchedCities([data]);
      });
    buttonTextValue();
  }, [listItems]);

  //Toggle event of adding/removing city from favorites
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

  //Fetch api of rated cities
const showReview = ()=>{
  fetchedTestimonials.map((testimonials) => {
    testimonials.map((testimonial) => {
      console.log(testimonial);
      listItems.map((searchedCity) => {
        if (
          testimonial.cityName === searchedCity.name &&
          testimonial.country === searchedCity.country
        ) {
          console.log(searchedCity);
          setExistingTestimonial(searchedCity.name);
          setRatingStar(testimonial.rating);
          setReviewText(testimonial.review);
        }
      });
    });
  });
}

  useEffect(() => {
    fetch("../api/rating")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setFetchedTestimonials([data]);
      });
      showReview();
  },[listItems]);
  
//Check if city is already rated
  useEffect(() => {
    
  }, [listItems]);

  const handleClickOnExistingTestimonial = () => {
    listItems.map((city) => {
      fetch("../api/rating", {
        method: "POST",
        body: JSON.stringify({
          rating: ratingStar,
          review: reviewText,
          cityName: city.name,
          country: city.country,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    });
    setExistingTestimonial("");
    setRatingStar("");
    setReviewText("");
  };

//Toggle even of submitting/deleting review
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    listItems.map((city) => {
      fetch("../api/rating", {
        method: "POST",
        body: JSON.stringify({
          rating: Object.values(data)[0],
          review: reviewText,
          cityName: city.name,
          country: city.country,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    });
    setRatingStar(Object.values(data)[0]);
    if (reviewButtonText === "Submit") {
      setReviewButtonText("Delete review");
      setIsSubmitted(true);
    } else {
      setReviewButtonText("Submit");
      setIsSubmitted(false);
      setReviewText("");
      setRatingStar("");
    }
  });

  const handleTextareaField = (e) => {
    e.preventDefault();
    setReviewText(e.target.value);
  };

  return (
    <Box bgColor="purple.50" h="100vh">
      <Flex mr="5" align="center" justify="space-between">
      <MenuBar />
      <Box >
      <FacebookShareButton
       url={'http://localhost:3000'} >
       <FacebookIcon size={32} round />
     </FacebookShareButton>
     <WhatsappShareButton
       url={'http://localhost:3000'} >
       <WhatsappIcon size={32} round />
     </WhatsappShareButton>
     <LinkedinShareButton
     url={'http://localhost:3000'} >
       <LinkedinIcon size={32} round></LinkedinIcon>
     </LinkedinShareButton>
      </Box>
      </Flex>
      
      <Container p="20px" centerContent="true">
        <Flex gap="25px">
          <Heading size="3xl">{cityId}</Heading>
          {weatherItems.length > 0 && (
            <Button onClick={(e) => handleClick(e)}>{buttonText}</Button>
          )}
        </Flex>
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
         
            <form
          onSubmit={onSubmit}
          className={
            existingTestimonial !== ""
              ? styles.testimonialHide
              : styles.testimonialShow
          }
        >
          <Stack gap="4" align="flex-start">
            <Box
              className={
                isSubmitted ? styles.testimonialHide : styles.testimonialShow
              }
            >
              <Field
                invalid={!!errors.rating}
                errorText={errors.rating?.message}
              >
                <Controller
                  control={control}
                  name="rating"
                  render={({ field }) => (
                    <Rating
                      size="lg"
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                    ></Rating>
                  )}
                ></Controller>
              </Field>
              <Field label="Write your review">
                <Textarea
                  placeholder=""
                  value={reviewText}
                  onChange={handleTextareaField}
                />
              </Field>
            </Box>
            {ratingStar !== "" && (
              <div
                className={
                  isSubmitted ? styles.testimonialShow : styles.testimonialHide
                }
              >
                <Stack maxW="320px" gap="4">
                  <Rating
                    colorPalette="orange"
                    readOnly
                    size="xs"
                    defaultValue={Number(ratingStar)}
                  />
                  <Text>{reviewText}</Text>
                </Stack>
              </div>
            )}

            <Button size="sm" type="submit">
              {reviewButtonText}
            </Button>
          </Stack>
        </form>
    

        {ratingStar !== "" && (
          <div
            className={
              existingTestimonial !== ""
                ? styles.testimonialShow
                : styles.testimonialHide
            }
          >
            <Stack maxW="320px" gap="4">
              <Rating
                colorPalette="orange"
                readOnly
                size="xs"
                defaultValue={Number(ratingStar)}
              />
              <Text>{reviewText}</Text>
            </Stack>
            <Button size="sm" onClick={handleClickOnExistingTestimonial}>
              Delete review
            </Button>
          </div>
        )}
      </Container>
      
    </Box>
  );
}
