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
    <div className="flex h-full flex-col">
      {activeRestaurantId != null ? (
        <div className="grid flex-grow grid-cols-3 grid-rows-4 gap-4">
          <div className="col-span-2 row-span-2 h-full w-full border">
            {" "}
            {restaurant != undefined && (
              <RestaurantData restaurant={restaurant} />
            )}
          </div>
          <div className="col-start-3 row-span-2 h-full w-full border">
            Oceny
          </div>
          <div className="col-span-2 row-span-2 row-start-3 h-full w-full border">
            <EmployeeManagement activeRestaurantId={activeRestaurantId} />
          </div>
        </div>
      ) : (
        <h1>Select a restaurant</h1>
      )}
    </div>
  );
};

export default RestaurantDetails;
