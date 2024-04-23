import React, { useState } from "react";
import MyGroups from "./MyGroups";
import RestaurantDetails from "./RestaurantDetails";

const RestaurantManager = () => {
  const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(
    null,
  );
  const [editable, setEditable] = useState<boolean>(false);

  const handleChangeActiveRestaurant = (restaurantId: number) => {
    if (activeRestaurantId !== restaurantId) {
      setEditable(false);
    }
    setActiveRestaurantId(restaurantId);
  };

  return (
    <div className="flex h-full w-full bg-grey-1 bg-grey-1 dark:bg-grey-3">
      <div className="mx-3 h-full w-[14.6rem] bg-grey-1 dark:bg-grey-3">
        <MyGroups
          activeRestaurantId={activeRestaurantId}
          handleChangeActiveRestaurant={handleChangeActiveRestaurant}
        />
      </div>
      <RestaurantDetails
        activeRestaurantId={activeRestaurantId}
        editable={editable}
        setEditable={setEditable}
      />
    </div>
  );
};

export default RestaurantManager;
