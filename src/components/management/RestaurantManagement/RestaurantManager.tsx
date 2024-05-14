import React, { useState } from "react";
import MyGroups from "./MyGroups";
import RestaurantDetails from "./RestaurantDetails";
import RestaurantDashboard from "./RestaurantDashboard";

const RestaurantManager = () => {
  const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(
    null,
  );
  const [editable, setEditable] = useState<boolean>(false);

  const handleChangeActiveRestaurant = (restaurantId: number) => {
    setActiveRestaurantId(restaurantId);
  };

  return (
    <div className="flex h-full w-full bg-grey-1 bg-grey-1 dark:bg-grey-3">
      <div className="z-[0] flex flex w-full gap-2 p-2">
        <div className="flex h-full w-1/5 flex-col gap-2">
          <div className="flex items-center justify-center h-[4rem] w-full rounded-md bg-white dark:bg-black shadow-md text-primary-2 dark:text-secondary font-mont-md">
            RESTAURANT DASHBOARD
          </div>
          <div className="h-full w-full rounded-md bg-white dark:bg-black shadow-md">
           <MyGroups
              activeRestaurantId={activeRestaurantId}
              handleChangeActiveRestaurant={handleChangeActiveRestaurant}
            />
          </div>
        </div>
        <div className="flex h-full w-full flex-col gap-2">
          <div className="h-full w-full rounded-md">
            {activeRestaurantId === null ? (
              <RestaurantDashboard/>
            ) : (
              <RestaurantDetails
                activeRestaurantId={activeRestaurantId}
                editable={editable}
                setEditable={setEditable}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManager;
