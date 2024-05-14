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
      <div className="w-[14.6rem] h-full z-[0] bg-white dark:bg-black flex flex-col items-center">
        <MyGroups
          activeRestaurantId={activeRestaurantId}
          handleChangeActiveRestaurant={handleChangeActiveRestaurant}
        />
      </div>
      {
        // activeRestaurantId === null ? (
        //   <h1> pick a restaurant </h1>
        // ) : (
        //   <RestaurantDetails
        //     activeRestaurantId={activeRestaurantId}
        //     editable={editable}
        //     setEditable={setEditable}
        //   />
        // )
      }
    </div>
  );
};

export default RestaurantManager;
