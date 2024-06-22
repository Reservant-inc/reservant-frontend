import React, { useEffect, useState } from "react";
import Map from "./map/Map";
import {
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import FocusedRestaurantDetails from "./restaurant/view/FocusedRestaurantDetails";
import { fetchGET } from "../services/APIconn";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<any>(null);
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
        setRestaurants(response);
      } catch (error) {
        console.error("Error getting restaurants", error);
      }
    };
    getRestaurants();
  }, [bounds]);

  return (
    <div className="relative flex h-[calc(100%-3.5rem)] w-full bg-grey-1 dark:bg-grey-3">
      <div className="h-full w-[15%] bg-white shadow-md p-3">
        <input type="text" className="rounded-full w-full"/>
        <List
          className="font-mont-md dark:bg-black"
          sx={{ width: "100%" }}
          component="nav"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Restaurants near you
            </ListSubheader>
          }
        >
          {restaurants.map((restaurant, index) => (
            <ListItemButton
              onClick={() => setActiveRestaurant(restaurant)}
              key={index}
            >
              <ListItemText primary={restaurant.name} />
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
      <div className="z-[0] h-full w-[85%]">
        <Map
          activeRestaurant={activeRestaurant}
          restaurants={restaurants}
          setActiveRestaurant={setActiveRestaurant}
          setBounds={setBounds}
        />
      </div>
    </div>
  );
}
