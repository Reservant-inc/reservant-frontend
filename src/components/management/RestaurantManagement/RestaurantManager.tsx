import React, { useState } from "react";
import MyGroups from "./MyGroups";
import RestaurantDetails from "./RestaurantDetails";

const RestaurantManager = () => {
  const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(
    null,
  );

  const handleChangeActiveRestaurant = (restaurantId: number) => {
    setActiveRestaurantId(restaurantId);
  };

  return (
    <div className="flex h-full w-full bg-grey-1 bg-grey-1 dark:bg-grey-3">
      <div className="mx-3 w-[14.6rem] bg-grey-1 dark:bg-grey-3 flex flex-col items-center">
        <button className="mt-5 mb-2 h-8 w-48 rounded-lg p-2 bg-primary-2 font-mont-md text-white dark:bg-secondary dark:text-black flex justify-center items-center">Add restaurant</button>
        <MyGroups
          activeRestaurantId={activeRestaurantId}
          handleChangeActiveRestaurant={handleChangeActiveRestaurant}
        />
      </div>
      <RestaurantDetails activeRestaurantId={activeRestaurantId} />
    </div>
  );
};

export default RestaurantManager;
