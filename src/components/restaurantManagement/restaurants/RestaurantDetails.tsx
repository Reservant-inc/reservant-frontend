import React, { useEffect, useState } from "react";
import {
  RestaurantDataType,
  RestaurantDetailsType,
  ReviewType,
} from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { useTranslation } from "react-i18next";
import { Avatar, Box, Button, Modal, Rating } from "@mui/material";
import EmployeeRestaurantManagement from "../employees/EmployeeRestaurantManagement";
import IngredientTable from "../Warehouse/IngredientTable";
import MenuList from "../menus/MenuList";
import { MenuScreenType } from "../../../services/enums";
import FocusedRestaurantReviewsList from "../../restaurant/onMapView/FocusedRestaurantReviewsList";
import ReviewsManagement from "../ReviewsMenagment";

interface RestaurantDetailsProps {
  activeRestaurantId: number ;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  activeRestaurantId,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [t] = useTranslation("global");
  const [reviews, setReviews] = useState<ReviewType[]>([]);


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
  useEffect(()=>{
    const fetchRestaurantReviews = async () => {
      try {
        const data = await fetchGET(`/restaurants/${activeRestaurantId}/reviews`);
        setReviews(data.items || []);
      } catch (error) {
        console.error("Error fetching restaurant reviews:", error);
      }
    };
    fetchRestaurantReviews();
  }, [])

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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
    <div className="w-full h-full gap-4 rounded-lg overflow-y-auto scroll space-y-4 bg-white dark:bg-black">
     
    </div>
  );
};

export default RestaurantDetails;
