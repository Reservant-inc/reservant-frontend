import React, { useEffect, useState } from "react";
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement";
import MenuManagement from "../MenuManagement/MenuMangement";
import { RestaurantDetailsProps } from "../../../services/interfaces";
import {
  RestaurantDataType,
  RestaurantDetailsType,
} from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useValidationSchemas } from "../../../hooks/useValidationSchema";
import Section from "./ManagementSection";
import RestaurantData from "./RestaurantData";
import RestaurantReviewsList from "./restaurantReviews/RestaurantReviewsList";

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  activeRestaurantId,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>();
  const [t] = useTranslation("global");
  const [page, setActivePage] = useState<number>(0)

  useEffect(() => {
    if (activeRestaurantId != null) {
      const fetchData = async () => {
        try {
          const data = await fetchGET(`/my-restaurants/${activeRestaurantId}`);
          setRestaurant(data);
        } catch (error) {
          console.error("Error fetching restaurant: ", error);
        }
      }
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
    <div className="flex w-full h-full flex gap-2">
      <div className="flex flex-col gap-2 w-[35rem] h-full">
        <div className="bg-white w-full rounded-md shadow-md h-[30rem]">
          {
            restaurant != null && <RestaurantData restaurant={restaurant as RestaurantDetailsType}/>
          }
        </div>
        <div className="bg-white w-full rounded-md shadow-md h-full">
          <RestaurantReviewsList />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full h-full">
        <div className="w-full h-[5%] flex gap-2">
          <button id="RestaurantDetailsFirstActivePageButton" className="p-2 h-full bg-white rounded-full shadom-lg hover:bg-primary-2 hover:text-white" onClick={() => setActivePage(0)}>Employee management</button>
          <button id="RestaurantDetailsSecondActivePageButton" className="p-2 h-full bg-white rounded-full shadom-lg hover:bg-primary-2 hover:text-white" onClick={() => setActivePage(1)}>Menu management</button>
          <button id="RestaurantDetailsStatisticsButton" className="p-2 h-full bg-white rounded-full shadom-lg hover:bg-primary-2 hover:text-white">Statistics</button>
          <button id="RestaurantDetailsShipmentButton" className="p-2 h-full bg-white rounded-full shadom-lg hover:bg-primary-2 hover:text-white">Shipment management</button>
        </div>
        <div className="bg-white shadow-md rounded-md w-full h-full">
          { 
            {
              1: <MenuManagement activeRestaurantId={activeRestaurantId} />
            }[page]
          }
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
