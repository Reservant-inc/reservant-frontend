import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GroupProps } from "../../../services/interfaces";
import { RestaurantType } from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";

const Group: React.FC<GroupProps> = ({
  id,
  name,
  restaurantCount,
  handleChangeActiveRestaurant,
  activeRestaurantId,
}) => {
  const [t] = useTranslation("global");
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGET(`/my-restaurant-groups/${id}`);
        setRestaurants(response.restaurants);
      } catch (error) {
        console.error("Error fetching groups: ", error);
      }
    };

    fetchData();
  }, [id]);

  const handleIsPressed = (e: React.MouseEvent<HTMLHeadingElement>) => {
    e.preventDefault();
    setIsPressed((isPressed) => !isPressed);
  };

  return (
    <div className={"mt-2 dark:text-white text-black overflow-hidden rounded"}>
      <div className="flex items-center justify-between hover:cursor-pointer" onClick={handleIsPressed}>
        <h2
          className="p-2 truncate text-xl text-base font-semibold mr-1"
        >
          {name}
        </h2>
        {isPressed ? 
            (
              <svg className="h-5 min-w-5 m-1 fill-black dark:fill-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z"/>
              </svg>
            ) : (   
              <svg className="h-5 min-w-5 m-1 fill-black dark:fill-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"/>
              </svg>
            )
        }
      </div>

      {isPressed && (
        <div className="p-2"> 
          <ul>
            {restaurants.map((restaurant) => (
              <li
                key={restaurant.id}
                className="ml-2 transition duration-300 flex"
              >
                <span className="w-[3px] dark:w-[2px] bg-primary-2 dark:bg-secondary-2"> </span>
                <div
                  className={`ml-5 my-1 flex w-full cursor-pointer bg-grey-1 dark:bg-grey-4 rounded items-center justify-between p-1 transition duration-300 ${activeRestaurantId === restaurant.id ? " dark:bg-secondary-2 bg-primary-2 dark:text-black text-white font-mont-md" : ""}`}
                  onClick={() => handleChangeActiveRestaurant(restaurant.id)}
                >
                  {restaurant.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="w-full h-[1px] bg-grey-2 mt-2" />
    </div>
  );
};

export default Group;
