import React, { useEffect, useState } from "react";
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement";
import MenuManagement from "../MenuManagement/MenuMangement";
import { RestaurantDetailsProps } from "../../../services/interfaces";
import {
  RestaurantDataType,
  RestaurantDetailsType,
} from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { useTranslation } from "react-i18next";
import RestaurantData from "./RestaurantData";
import RestaurantReviewsList from "./restaurantReviews/RestaurantReviewsList";

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  activeRestaurantId,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>();
  const [t] = useTranslation("global");
  const [page, setActivePage] = useState<number>(0);

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
    <div className="flex flex h-full w-full gap-2">
      <div className="flex h-full w-[35rem] flex-col gap-2">
        <div className="h-[30rem] w-full rounded-md bg-white shadow-md">
          {restaurant != null && (
            <RestaurantData restaurant={restaurant as RestaurantDetailsType} />
          )}
        </div>
        <div className="h-full w-full rounded-md bg-white shadow-md">
          <RestaurantReviewsList />
        </div>
      </div>
      <div className="flex h-full w-full flex-col gap-2">
        <div className="flex h-[5%] w-full gap-2">
          <button
            id="RestaurantDetailsFirstActivePageButton"
            className="shadom-lg h-full rounded-full bg-white p-2 hover:bg-primary hover:text-white"
            onClick={() => setActivePage(0)}
          >
            Employee management
          </button>
          <button
            id="RestaurantDetailsSecondActivePageButton"
            className="shadom-lg h-full rounded-full bg-white p-2 hover:bg-primary hover:text-white"
            onClick={() => setActivePage(1)}
          >
            Menu management
          </button>
          <button
            id="RestaurantDetailsStatisticsButton"
            className="shadom-lg h-full rounded-full bg-white p-2 hover:bg-primary hover:text-white"
          >
            Statistics
          </button>
          <button
            id="RestaurantDetailsShipmentButton"
            className="shadom-lg h-full rounded-full bg-white p-2 hover:bg-primary hover:text-white"
          >
            Shipment management
          </button>
        </div>
        <div className="h-full w-full rounded-md bg-white shadow-md">
          {
            {
              1: <MenuManagement activeRestaurantId={activeRestaurantId} />,
            }[page]
          }
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
