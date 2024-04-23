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
    <div className="flex h-full w-full bg-grey-1 dark:bg-grey-4">
      <div className="h-full  w-[14.6rem] bg-white dark:bg-[#272727]">
        <MyGroups
          activeRestaurantId={activeRestaurantId}
          handleChangeActiveRestaurant={handleChangeActiveRestaurant}
        />
      </div>
      {/* <div className="m-2 w-full bg-white dark:bg-black">
        <div className="h-full">
          <RestaurantDetails activeRestaurantId={activeRestaurantId} />
        </div>
      </div> */}
    </div>
  );
};

export default RestaurantManager;
