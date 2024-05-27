import React, { useEffect, useState } from "react";
import { RestaurantDetailsProps } from "../../../services/interfaces";
import {
  RestaurantDataType,
  RestaurantDetailsType,
} from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { useTranslation } from "react-i18next";
import RestaurantReviewsList from "./restaurantReviews/RestaurantReviewsList";

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  activeRestaurantId,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>();
  const [t] = useTranslation("global");

  useEffect(() => {
    if (activeRestaurantId != null) {
      const fetchData = async () => {
        try {
          const data = await fetchGET(`/my-restaurants/${activeRestaurantId}`);
          setRestaurant(data);
        } catch (error) {
          console.error("Error fetching restaurant: ", error);
        }
      };
      fetchData();
    }
  }, [activeRestaurantId]);

  const defaultInitialValues: Partial<RestaurantDataType> = {
    name: restaurant?.name,
    address: restaurant?.address,
    city: restaurant?.city,
    postalIndex: restaurant?.postalIndex,
    restaurantType: restaurant?.restaurantType,
    description: restaurant?.description,
    tags: restaurant?.tags,
    nip: restaurant?.nip,
    groupId: restaurant?.groupId, //TODO
    provideDelivery: restaurant?.provideDelivery,
    rentalContract: restaurant?.rentalContract,
    alcoholLicense: restaurant?.alcoholLicense,
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full h-[50%] bg-white rounded-lg shadow-md">

      </div>
      <div className="w-full h-[50%] flex gap-4">
        <div className="h-full w-[50%] bg-white rounded-lg shadow-md">

        </div>
        <div className="h-full w-[50%] bg-white rounded-lg shadow-md p-2">
          <h1 className="h-[2rem] w-full">Customers opinions</h1>
          <div className="h-[calc(100%-4rem)]">
            <RestaurantReviewsList/>
          </div>
          <div className="h-[2rem] w-full">

          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
