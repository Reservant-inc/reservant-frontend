import React from "react";
import { RestaurantDataProps } from "../../../services/interfaces";

const RestaurantData: React.FC<RestaurantDataProps> = ({ restaurant }) => {
  return (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-1">
      <div className="border">
        <p>Logo</p>
        <p className="font-bold">{restaurant.name}</p>
        <p>{restaurant.address}</p>
        <p>{restaurant.city}</p>
        <p>{restaurant.postalIndex}</p>
      </div>
      <div className="border">
        <p>{restaurant.description}</p>
      </div>
      <div className="flex border">
        <div className="flex-1 border">Zdjecie 1</div>
        <div className="flex-1 border">Popup withe the rest of the Gallery</div>
      </div>
      <div className="border"></div>
      <div className="col-span-2 border">
        <p></p>
      </div>
    </div>
  );
};

export default RestaurantData;
