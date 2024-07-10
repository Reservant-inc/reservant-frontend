import React, { useEffect, useState } from "react";
import Map from "./map/Map";
import {
  Button,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Rating,
  Typography,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import StarPurple500SharpIcon from '@mui/icons-material/StarPurple500Sharp';
import LocalOfferSharpIcon from '@mui/icons-material/LocalOfferSharp';
import FocusedRestaurantDetails from "./restaurant/view/FocusedRestaurantDetails";
import { fetchGET } from "../services/APIconn";
import OutsideClickHandler from "./reusableComponents/OutsideClickHandler";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<any>(null);
  const [loadedRestaurantIds, setLoadedRestaurantIds] = useState<Set<number>>(new Set());
  const [userMovedMap, setUserMovedMap] = useState<boolean>(false);
  const [isReviewFilterPressed, setIsReviewFilterPressed] = useState<boolean>(false)
  const [isTagFilterPressed, setIsTagFilterPressed] = useState<boolean>(false)
  const [reviewFilter, setReviewFilter] = useState<number>(0)

  //center of warsaw, cant get users location without https
  const [bounds, setBounds] = useState<any>({
    lat1: 52.25255454924618,
    lat2: 52.20718589303197,
    lon1: 21.06353759765625,
    lon2: 20.959854125976566
  });

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await fetchGET(`/restaurants/in-area?lat1=${bounds.lat1}&lon1=${bounds.lon1}&lat2=${bounds.lat2}&lon2=${bounds.lon2}`);
        const newRestaurants = response.filter((restaurant: any) => !loadedRestaurantIds.has(restaurant.restaurantId));
         
        console.log(newRestaurants.length)
        if (newRestaurants.length > 0) {
          setRestaurants([...restaurants, ...newRestaurants]);
          setLoadedRestaurantIds(prev => {
            const updated = new Set(prev);
            newRestaurants.forEach((restaurant: any) => updated.add(restaurant.restaurantId));
            return updated;
          });
        }
      } catch (error) {
        console.error("Error getting restaurants", error);
      }
    };
    getRestaurants();
  }, [bounds]);

  const reviewsPressHandler = () => {
    setIsReviewFilterPressed(!isReviewFilterPressed)
  }

  const tagsPressHandler = () => {
    setIsTagFilterPressed(!isTagFilterPressed)
  }

  return (
    <div id="homePage-wrapper" className="relative flex h-[calc(100%-3.5rem)] w-full bg-grey-1 dark:bg-grey-3">
      <div id="homePage-restaurantList-wrapper" className="h-full w-[17.5%] bg-white shadow-md p-3">
      <InputBase
        placeholder="Search for restaurants"
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
        <List
          id="homePage-restaurantList"
          className="font-mont-md dark:bg-black w-full"
          component="nav"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Restaurants near you
            </ListSubheader>
          }
        >
          {restaurants.map((restaurant, index) => (
            <ListItemButton id="homePage-listItemButton"
              onClick={() => {
                setUserMovedMap(false)
                setActiveRestaurant(restaurant)
              }}
              key={index}
            >
              <ListItemText id="homePage-listItemText" primary={restaurant.name} />
            </ListItemButton>
          ))}
        </List>
      </div>
      {activeRestaurant && (
        <FocusedRestaurantDetails
          restaurantId={activeRestaurant.ID}
          onClose={() => setActiveRestaurant(null)}
        />
      )}
      <div id="map" className="z-[0] h-full w-[85%]">
        <Map
          activeRestaurant={activeRestaurant}
          restaurants={restaurants}
          setActiveRestaurant={setActiveRestaurant}
          setBounds={setBounds}
          setUserMovedMap={setUserMovedMap}
          userMovedMap={userMovedMap}
        />
      </div>
      <div className="absolute left-[calc(17.5%+15px)] h-[40px] w-[450px] top-[15px] flex items-center gap-4">
          <OutsideClickHandler onOutsideClick={reviewsPressHandler} isPressed={isReviewFilterPressed}>
            <Button id="homePage-reviewsFilter" className={"h-full rounded-lg shadow-md p-2 flex gap-2 " + (reviewFilter != 0 ? "bg-primary text-white" : "bg-white text-black")}
              onClick={reviewsPressHandler}
            >
              <StarPurple500SharpIcon className="h-6"/>
              {   
              reviewFilter === 0 ? "Reviews" : `${reviewFilter}.0 or more`
              } 
            </Button>
              {isReviewFilterPressed && (
                <div className="absolute top-[55px] bg-white z-[2] shadow-2xl rounded-lg">
                  <List
                    id="homePage-restaurantList"
                    className="font-mont-md dark:bg-black w-full"
                  >
                    <ListItemButton
                      id="homePage-listItemButton"
                      className="flex gap-2 justify-center items-center"
                      onClick={() => {
                        setReviewFilter(0)
                        setIsReviewFilterPressed(false)
                      }}
                    >
                      <Typography component="legend">Any rating</Typography>
                    </ListItemButton>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <ListItemButton
                        id="homePage-listItemButton"
                        className="flex gap-2 justify-center items-center"
                        onClick={() => {
                          setReviewFilter(value)
                          setIsReviewFilterPressed(false)
                        }}
                        key={value}
                      >
                        <Typography component="legend">{value}.0</Typography>
                        <Rating name="read-only" value={value} readOnly />
                      </ListItemButton>
                    ))}
                  </List>
                </div>  
              )}
          </OutsideClickHandler>
          <OutsideClickHandler onOutsideClick={tagsPressHandler} isPressed={isTagFilterPressed}>
            <Button id="homePage-tagssFilter" className={"h-full rounded-lg shadow-md p-2 flex gap-2 bg-white text-black"}
              onClick={tagsPressHandler}
            >
              <LocalOfferSharpIcon className="h-6"/>
              Tags
            </Button>
              {isTagFilterPressed && (
                <div className="absolute top-[55px] bg-white z-[2] shadow-2xl rounded-lg w-24 h-24">

                </div>  
              )}
          </OutsideClickHandler>
      </div>
    </div>
  );
}
