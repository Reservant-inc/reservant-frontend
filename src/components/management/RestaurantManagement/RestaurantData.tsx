import React from "react";
import { RestaurantDataProps } from "../../../services/interfaces";
import EditSharpIcon from '@mui/icons-material/EditSharp';

const RestaurantData: React.FC<RestaurantDataProps> = ({ restaurant }) => {

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-6 p-3">
        <img src={`${process.env.REACT_APP_SERVER_IP}${restaurant.logo}`} alt="heh" className="w-16 h-16 bg-grey-1 rounded-full shadow-lg"/>
        <h1 className="text-lg text-primary-2 dark:text-secondary font-mont-md">{restaurant.name}</h1>
        <EditSharpIcon
          sx={{
            height: '16px'
          }}
        />
      </div>
      <div className="w-auto h-[3px] bg-grey-1 mx-2"/>
      <div className="w-full h-full flex gap-2 p-4">
          {restaurant.description}
      </div>
    </div>
  );
};

export default RestaurantData;
