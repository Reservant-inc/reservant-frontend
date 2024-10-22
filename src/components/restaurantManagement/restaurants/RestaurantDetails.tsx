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
    <div className="w-full h-full gap-4 rounded-tr-lg rounded-b-lg overflow-y-auto scroll space-y-4">
      <div className="w-full h-1/2 bg-white rounded-b-lg shadow-md"></div>
      
      <div className="w-full h-1/2 flex gap-4">
        <div className="h-full w-[50%] bg-white rounded-lg shadow-md">

        </div>
        <div className="h-full w-[50%] bg-white rounded-lg shadow-md flex flex-col p-4 gap-4">
          <div className="h-[calc(100%-2rem)] overflow-auto">
            <FocusedRestaurantReviewsList isPreview={true} reviews={reviews} activeRestaurantId={activeRestaurantId}/>
          </div>
          <div className="flex h-[2rem] items-center justify-end">
            <Button
              className="text-md rounded-lg font-mont-md text-grey-2"
              onClick={handleOpen}
            >
              Show all
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-full w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
        <div className="flex h-[2rem] items-center">
          <h1 className="font-mont-md text-xl">Employee management</h1>
        </div>
        <div className="h-[calc(100%-6rem)]">
          <EmployeeRestaurantManagement activeRestaurantId={activeRestaurantId + ""} />
        </div>
      </div>

      <div className="flex h-full w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
        <div className="flex h-[2rem] items-center">
          <h1 className="font-mont-md text-xl">Menus</h1>
        </div>
        <div className="h-[calc(100%-6rem)]">
          <div className="bg-white dark:bg-black p-3 rounded-b-lg h-full">
            <MenuList activeRestaurantId={activeRestaurantId} type={MenuScreenType.Management}/>
          </div>
        </div>
      </div>

      {/* Nowy div z IngredientTable */}
      <div className="flex h-full w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
        <div className="flex h-[2rem] items-center">
          <h1 className="font-mont-md text-xl">Ingredients</h1>
        </div>
        <div className="h-[calc(100%-6rem)]">
          <IngredientTable activeRestaurantId={activeRestaurantId} /> 
        </div>
      </div>

      <div className="h-full w-full rounded-lg bg-white shadow-md"></div>
      <div className="h-full w-full rounded-lg bg-white shadow-md"></div>

      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center"
      >
        <Box className="h-[800px] w-[1200px] rounded-lg bg-white p-4"></Box>
      </Modal>
    </div>
  );
};

export default RestaurantDetails;
