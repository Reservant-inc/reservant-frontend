import React from "react";
import { RestaurantDataProps } from "../../../services/interfaces";
import EditSharpIcon from "@mui/icons-material/EditSharp";

const RestaurantData: React.FC<RestaurantDataProps> = ({ restaurant }) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-6 p-3">
        <img
          src={`${process.env.REACT_APP_SERVER_IP}${restaurant.logo}`}
          alt="heh"
          className="h-16 w-16 rounded-full bg-grey-1 shadow-lg"
        />
        <h1 className="font-mont-md text-lg text-primary-2 dark:text-secondary">
          {restaurant.name}
        </h1>
        <EditSharpIcon
          sx={{
            height: "16px",
          }}
        />
      </div>
      <div className="mx-2 h-[3px] w-auto bg-grey-1" />
      <div className="flex h-full w-full gap-2 p-4">
        {restaurant.description}
      </div>
    </div>
  );
};

export default RestaurantData;
