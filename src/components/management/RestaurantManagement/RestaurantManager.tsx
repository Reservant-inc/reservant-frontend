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
      <div className="mx-3 flex w-[14.6rem] flex-col items-center bg-grey-1 dark:bg-grey-3">
        <button className="mb-2 mt-5 flex h-8 w-48 items-center justify-center rounded-lg bg-primary-2 p-2 font-mont-md text-white dark:bg-secondary dark:text-black">
          Add restaurant
        </button>
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
