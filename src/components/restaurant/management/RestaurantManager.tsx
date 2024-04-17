import React, { useState } from "react";
import MyGroups from "./MyGroups";
import RestaurantDetails from "./RestaurantDetails";
import { Route, Routes } from "react-router";

const RestaurantManager = () => {
    const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(null);

    const handleChangeActiveRestaurant = (restaurantId: number) => {
        setActiveRestaurantId(restaurantId);
    }
    
    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full">
            <div className="md:w-1/6 mx-4 bg-cream h-full w-full md:h-auto">
                <MyGroups activeRestaurantId={activeRestaurantId} handleChangeActiveRestaurant={handleChangeActiveRestaurant}/>
            </div>
            <div className="md:w-5/6 mt-4 md:mr-4 w-full flex-grow">
                <div className="h-full">
                   <RestaurantDetails activeRestaurantId={activeRestaurantId}/>
                </div>
            </div>
        </div>
    );
}

export default RestaurantManager;

 