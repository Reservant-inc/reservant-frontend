import React, { useEffect, useState } from "react";
import Map from "./map/Map";
import {
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import FocusedRestaurantDetails from "./restaurant/view/FocusedRestaurantDetails";

const dummy = [
  {
    name: "Johns Doe's 1",
    location: {
      latitude: 52.396255,
      longitude: 21.00044,
    },
  },
  {
    name: "Johns Doe's 2",
    location: {
      latitude: 52.227209,
      longitude: 21.021726,
    },
  },
  {
    name: "Johns Doe's 3",
    location: {
      latitude: 52.227315,
      longitude: 21.00765,
    },
  },
  {
    name: "Mactruck",
    location: {
      latitude: 52.232572,
      longitude: 20.998209,
    },
  },
  {
    name: "Rybsko",
    location: {
      latitude: 52.221741,
      longitude: 21.012285,
    },
  },
  {
    name: "Kubel pomyj",
    location: {
      latitude: 52.221426,
      longitude: 21.001642,
    },
  },
  {
    name: "Mordor",
    location: {
      latitude: 52.223938,
      longitude: 20.990953,
    },
  },
];

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<any>(null);

  useEffect(() => {
    setRestaurants(dummy);
  }, []);

  return (
    <div className="relative flex h-[calc(100%-3.5rem)] w-full bg-grey-1 dark:bg-grey-3">
      <div className="h-full w-[15%] bg-white shadow-md">
        <input type="text" />
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
          restaurantId={1} // Replace with actual restaurant ID
          onClose={() => setActiveRestaurant(null)}
        />
      )}
      <div className="z-[0] h-full w-[85%]">
        <Map
          activeRestaurant={activeRestaurant}
          restaurants={restaurants}
          setActiveRestaurant={setActiveRestaurant}
        />
      </div>
    </div>
  );
}
