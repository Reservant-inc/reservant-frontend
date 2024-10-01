import React, { useEffect, useState } from "react";
import { fetchGET } from "../../../../services/APIconn";
import {
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from "@mui/icons-material/Close";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import MopedIcon from "@mui/icons-material/Moped";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Carousel from "../../../reusableComponents/ImageCarousel/Carousel";
import { RestaurantDetailsType, ReviewType } from "../../../../services/types";
import FocusedRestaurantReviewsList from "./FocusedRestaurantReviewsList";
import CustomRating from "../../../reusableComponents/CustomRating";
import { useTranslation } from "react-i18next";

interface FocusedRestaurantDetailsProps {
  activeRestaurant: RestaurantDetailsType;
  onClose: () => void;
}

const FocusedRestaurantDetails: React.FC<FocusedRestaurantDetailsProps> = ({
  activeRestaurant,
  onClose,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>(activeRestaurant); 
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const [t] = useTranslation("global")
 
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await fetchGET(`/restaurants/${activeRestaurant.restaurantId}`);
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    const fetchRestaurantReviews = async () => {
      try {
        const data = await fetchGET(`/restaurants/${activeRestaurant.restaurantId}/reviews`);
        setReviews(data.items || []);
      } catch (error) {
        console.error("Error fetching restaurant reviews:", error);
      }
    };

    fetchRestaurantDetails();
    fetchRestaurantReviews();
  }, [activeRestaurant]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
    : 0;

  return (
    <>
      {!restaurant ? (
        <CircularProgress className="h-8 w-8 text-grey-0" />
      ) : (
        <>
          <div className="relative">
            <IconButton
              onClick={onClose}
              className="absolute right-2 top-2 z-10 h-8 w-8 bg-white dark:bg-grey-5 dark:text-grey-1"
            >
              <CloseIcon />
            </IconButton>
            <div className="w-full h-[250px]">
              {restaurant && (
                <Carousel
                  images={[
                    restaurant.logo,
                    ...(restaurant.photos || []),
                  ]}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="p-3 flex flex-col gap-2">
              <div className="flex gap-5 items-center w-full justify-between">
                <h2 className="text-2xl font-bold dark:text-white">{restaurant.name}</h2>
                <div className="flex items-center gap-2 dark:text-white">
                  <h1>{averageRating.toFixed(2)}</h1>
                  <CustomRating rating={averageRating} readOnly={true}/>
                  <h1>({reviews.length})</h1>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-sm dark:text-white">
                  {restaurant.address}, {restaurant.city}
                </h1>
                <div className="text-sm flex items-center gap-3">
                  {restaurant.provideDelivery && (
                    <div className="flex gap-2 items-center">
                      <MopedIcon className="dark:text-white w-5 h-5"/> 
                      <h1 className="dark:text-white">{t("home-page.delivery-fee")} 5,99 zł</h1>
                    </div>
                  )}
                  <div className="flex gap-1 items-center">
                    <h1 className="dark:text-white">
                      {t("home-page.is-delivering")}:
                    </h1>
                    {restaurant.provideDelivery ? (
                      <CheckCircleIcon className="text-green-500 dark:text-white w-5 h-5" />
                    ) : (
                      <CancelIcon className="text-red-500 dark:text-white w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <span className="w-full bg-grey-1 h-[1px]"></span>
            <div className="p-3 w-full rounded-lg flex gap-2 justify-around">
              <div className="flex h-full items-center flex-col gap-1 w-[70px]">
                <button className="w-12 h-12 border-[1px] border-primary rounded-full dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary transition hover:scale-105">
                  <EditCalendarIcon className="w-6 h-6"/>
                </button>
                <h1 className="text-[11px] text-primary dark:text-secondary">{t("home-page.reservation")}</h1>
              </div>
              <div className="flex h-full items-center flex-col gap-1 w-[70px]">
                <button className="w-12 h-12 border-[1px] border-primary rounded-full dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary transition hover:scale-105">
                  <EventIcon className="w-6 h-6"/>
                </button>
                <h1 className="text-[11px] text-primary dark:text-secondary text-center">{t("home-page.create-event")}</h1>
              </div>
              <div className="flex h-full items-center flex-col gap-1 w-[70px]">
                <button className="w-12 h-12 border-[1px] border-primary rounded-full dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary transition hover:scale-105">
                  <RestaurantMenuIcon className="w-6 h-6"/>
                </button>
                <h1 className="text-[11px] text-primary dark:text-secondary text-center">Menu</h1>
              </div>
              {
                restaurant.provideDelivery && (
                <div className="flex h-full items-center flex-col gap-1 w-[70px]">
                  <button className="w-12 h-12 border-[1px] border-primary rounded-full dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary transition hover:scale-105">
                    <DeliveryDiningIcon className="w-6 h-6"/>
                  </button>
                  <h1 className="text-[11px] text-primary dark:text-secondary text-center">{t("home-page.order")}</h1>
                </div>
                )
              }
            </div>
            <span className="w-full bg-grey-1 h-[1px]"></span>
            <div className="p-3">
              <FocusedRestaurantReviewsList isPreview={false} reviews={reviews} activeRestaurantId={restaurant.restaurantId}/>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FocusedRestaurantDetails;
