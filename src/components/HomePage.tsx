import React, { useEffect, useState } from "react";
import Map from "./map/Map";
import {
  Button,
  IconButton,
  List,
  ListItemButton,
  Rating,
  Typography,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import StarPurple500SharpIcon from '@mui/icons-material/StarPurple500Sharp';
import LocalOfferSharpIcon from '@mui/icons-material/LocalOfferSharp';
import FocusedRestaurantDetails from "./restaurant/view/OnMapView/FocusedRestaurantDetails";
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { fetchGET, getImage } from "../services/APIconn";
import OutsideClickHandler from "./reusableComponents/OutsideClickHandler";

export default function HomePage() {
  //change from any once backend finishes the API endpoint
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<any>(null);
  const [loadedRestaurantIds, setLoadedRestaurantIds] = useState<Set<number>>(new Set());
  const [userMovedMap, setUserMovedMap] = useState<boolean>(false);
  const [isReviewFilterPressed, setIsReviewFilterPressed] = useState<boolean>(false)
  const [isTagFilterPressed, setIsTagFilterPressed] = useState<boolean>(false)
  const [reviewFilter, setReviewFilter] = useState<number>(0)
  const [tags, setTags] = useState<string[]>([])
  const [chosenTags, setChosenTags] = useState<string[]>([])
  const [page, setPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  //center of warsaw, cant get users location without https
  const [bounds, setBounds] = useState<any>({
    lat1: 52.25255454924618,
    lat2: 52.20718589303197,
    lon1: 21.06353759765625,
    lon2: 20.959854125976566,
  });

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await fetchGET('/restaurant-tags');
        setTags(response)
      } catch (error) {
        console.error("Error getting restaurants", error);
      }
    };
    getTags();
  }, [])

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const tagsQuery = chosenTags.map((tag) => {
          return `&tags=${tag}`
        }).join('')

        const response = await fetchGET(`/restaurants?origLat=${52.225}&origLon=${21.01}&lat1=${bounds.lat1}&lon1=${bounds.lon1}&lat2=${bounds.lat2}&lon2=${bounds.lon2}${tagsQuery}&minRating=${reviewFilter}&page=${page}&perPage=${itemsPerPage}`);

        const newRestaurants = response.items.filter((restaurant: any) => !loadedRestaurantIds.has(restaurant.restaurantId));
        
        setRestaurants([...restaurants, ...newRestaurants]);
        
        setLoadedRestaurantIds(prevIds => {
          const newIds = new Set(prevIds);
          newRestaurants.forEach((restaurant: any) => newIds.add(restaurant.restaurantId));
          return newIds;
        });
      } catch (error) {
        console.error("Error getting restaurants", error);
      }
    };
    getRestaurants();
  }, [bounds, chosenTags, reviewFilter]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await fetchGET('/restaurant-tags');
        setTags(response);
      } catch (error) {
        console.error("Error getting tags", error);
      }
    };
    getTags();
  }, []);

  const reviewsPressHandler = () => {
    setIsReviewFilterPressed(!isReviewFilterPressed);
  };

  const tagsPressHandler = () => {
    setIsTagFilterPressed(!isTagFilterPressed);
  };

  const handleTagSelection = (tag: string) => {
    setChosenTags(prevTags => {
      const updatedTags = prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag];
      
      // Reset restaurants and loaded IDs
      setRestaurants([]);
      setLoadedRestaurantIds(new Set());
      return updatedTags;
    });
  };

  return (
    <div id="homePage-wrapper" className="relative flex h-[calc(100%-3.5rem)] w-full bg-grey-1 dark:bg-grey-3">
      <div id="homePage-restaurantList-wrapper" className="h-full w-[20%] min-w-[300px] bg-white shadow-md overflow-y-scroll scroll">
          <div className="p-3">
            <div className="w-full flex px-2 rounded-full border-[1px] border-grey-2">
            <input 
              type="text"
              placeholder="Search for restaurants"
              className="w-full clean-input"
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            </div>
          </div>
        <List
          id="homePage-restaurantList"
          className="font-mont-md dark:bg-black w-full"
          component="nav"
        >
          {restaurants.map((restaurant, index) => (
            <>
              <ListItemButton id="homePage-listItemButton"
                onClick={() => {
                  setUserMovedMap(false)
                  setActiveRestaurant(restaurant)
                }}
                key={index}
                className={activeRestaurant === restaurant ? "bg-grey-1" : "bg-white"}
              >
                <div className="flex items-start justify-between w-full py-3">
                  <div className="flex flex-col gap-1">
                    <h1 className="font-mont-md text-md">{restaurant.name}</h1>
                    <div className="flex">
                      <h1 className="text-sm">{restaurant.rating}</h1>
                      <Rating name="read-only" value={restaurant.rating} readOnly className="text-[18px]"/>
                      <h1 className="text-sm">{`(${restaurant.numberReviews})`}</h1>
                    </div>
                    <h1 className="text-sm font-mont-l">{restaurant.address}</h1>
                    <h1 className="text-sm font-mont-l">{restaurant.provideDelivery ? "Provides delivery" : "No delivery"}</h1>
                    <div className="flex gap-2">
                      {
                        restaurant.tags.map((tag : string) => (
                          <h1 className="text-sm font-mont-md bg-grey-0 rounded-full p-1 border-[1px] border-grey-1">{tag}</h1>
                        ))
                      }
                    </div>
                  </div>
                  <img src={getImage(restaurant.logo)} alt="logo" className="h-24 w-24 rounded-lg"/>
                </div>
              </ListItemButton>
              <div className="w-full h-0 border-b-[1px] border-grey-1"></div>
            </>
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
      <div className="absolute min-left-[300px] left-[20%] h-[40px] w-[450px] top-[15px] flex items-center gap-4">
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
                    {[2, 3, 4, 5].map((value) => (
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
            <Button id="homePage-tagssFilter" className={"h-full rounded-lg shadow-md p-2 flex items-center gap-2 " + (chosenTags.length > 0 ? "bg-primary text-white" : "bg-white text-black")}
              onClick={tagsPressHandler}
            >
              <LocalOfferSharpIcon className="h-6"/>
              {   
              chosenTags.length > 0 ? chosenTags.length === 1 ? `${chosenTags.length} tag` : `${chosenTags.length} tags` : "Tags"
              } 
              {
              chosenTags.length > 0 && <button className="h-[30px] w-[30px] rounded-full" onClick={() => setChosenTags([])}><CloseSharpIcon className="w-[30px]"/></button>  
              }
            </Button>
              {isTagFilterPressed && (
                <div className="absolute top-[55px] bg-white z-[2] shadow-2xl rounded-lg w-44 flex flex-wrap justify-start p-3 gap-2">
                  {
                    tags.map((tag, i) => (
                      <button
                        key={i}
                        className={`rounded-full border-[1px] border-grey-2 p-2 text-[12px] font-mont-md ${chosenTags.includes(tag) ? "text-white bg-primary" : "text-black bg-white"}`}
                        onClick={() => handleTagSelection(tag)}
                      >
                        {tag.toUpperCase()}
                      </button>
                    ))
                  }
                </div>  
              )}
          </OutsideClickHandler>
      </div>
    </div>
  );
}
