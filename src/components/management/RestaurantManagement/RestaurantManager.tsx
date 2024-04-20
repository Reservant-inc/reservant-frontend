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
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="mx-4 h-full w-full bg-cream md:h-auto md:w-1/6">
        <MyGroups
          activeRestaurantId={activeRestaurantId}
          handleChangeActiveRestaurant={handleChangeActiveRestaurant}
        />
      </div>
      <div className="mt-4 w-full flex-grow md:mr-4 md:w-5/6">
        <div className="h-full">
          <RestaurantDetails activeRestaurantId={activeRestaurantId} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantManager;
