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
            <div className="h-[10%] w-full z-1 shadow-sm">

            </div>
            <div className="h-[90%] w-full">
                <MyGroups activeRestaurantId={activeRestaurantId} handleChangeActiveRestaurant={handleChangeActiveRestaurant}/>
            </div>
        </div>
    )
}

export default RestaurantListSection