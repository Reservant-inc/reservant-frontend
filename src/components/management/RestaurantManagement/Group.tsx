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
      <h2
        className="p-2 truncate text-xl text-base font-semibold hover:cursor-pointer"
        onClick={handleIsPressed}
      >
        {name}
      </h2>

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
