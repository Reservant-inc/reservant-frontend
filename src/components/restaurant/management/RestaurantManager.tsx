import React from "react";
import MyGroups from "./MyGroups";
import RestaurantDetails from "./RestaurantDetails";

const RestaurantManager = () => {
    return ( 
        <div className="flex h-full">
            <div className="w-1/6 mx-4 bg-cream h-full"><MyGroups/></div>
            <div className="w-5/6 mt-4 mr-4"><RestaurantDetails/></div>
        </div>

     );
}
 
export default RestaurantManager;