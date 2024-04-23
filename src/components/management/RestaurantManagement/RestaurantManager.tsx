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
      <div className="h-full mx-3 w-[14.6rem] bg-grey-1 dark:bg-grey-3">
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
