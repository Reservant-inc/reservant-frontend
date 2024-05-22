import React from "react";
import RestaurantDetails from "./RestaurantDetails";
import RestaurantCart from "./RestaurantCart";

/*
Nie ma koncowki GET do pojedynczej restauracji na razie(?)
wiec robie dummy data zeby po prostu pokazac layout
Jak bedzie koncowka to dokoncze
*/

const dummyRestaurant = {};

const RestaurantView = () => {
  return (
    <div className="flex">
      <div className="basis-2/3">
        <RestaurantDetails />
      </div>
      <div className="flex basis-1/3">
        <div className="min-h-screen w-[1.5rem] bg-grey-1"></div>
        <RestaurantCart />
      </div>
    </div>
  );
};

export default RestaurantView;
