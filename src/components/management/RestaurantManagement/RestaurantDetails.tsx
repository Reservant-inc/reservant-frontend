import React, { useEffect, useState } from "react";
import RestaurantData from "./RestaurantData";
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement";
import { RestaurantDetailsProps } from "../../../services/interfaces";
import { RestaurantDetailsType } from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  activeRestaurantId,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>();

  useEffect(() => {
    if (activeRestaurantId != null) {
      const fetchData = async () => {
        try {
          const data = await fetchGET(`/my-restaurants/${activeRestaurantId}`);
          setRestaurant(data);
        } catch (error) {
          console.error("Error fetching groups: ", error);
        }
      };

      fetchData();
    }
  }, [activeRestaurantId]);

  return (
    <div className="flex h-full w-full flex rounded-xl py-4 px-4 gap-4">
      <div className="h-full rounded-xl w-full dark:bg-black bg-white">

      </div>
      <div className="h-full w-[32rem] flex gap-1">
        <div className="relative h-full w-[4rem] rounded-l-xl dark:bg-black bg-white flex items-center">
        </div>
        <div className="h-full w-full rounded-r-xl dark:bg-black bg-white">

        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
