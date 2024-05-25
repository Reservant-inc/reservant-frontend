import React, { useState } from "react";
import MyGroups from "./MyGroups";

const RestaurantListSection: React.FC = () => {
    const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(
        null,
      );
    
      const handleChangeActiveRestaurant = (restaurantId: number) => {
        setActiveRestaurantId(restaurantId);
      };

    return(
        <div className="h-full w-full">
            <div className="h-[4rem] w-full z-1 shadow-sm">

            </div>
            <div className="h-full w-full">
                <MyGroups activeRestaurantId={activeRestaurantId} handleChangeActiveRestaurant={handleChangeActiveRestaurant}/>
            </div>
        </div>
    )
}

export default RestaurantListSection