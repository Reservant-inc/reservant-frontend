import React, { useEffect, useState } from "react";
import { fetchGET } from "../../../services/APIconn";
import { IconButton, CircularProgress } from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import EventIcon from "@mui/icons-material/Event";
import CloseIcon from "@mui/icons-material/Close";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import MopedIcon from "@mui/icons-material/Moped";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Carousel from "../../reusableComponents/ImageCarousel/Carousel";
import { RestaurantDetailsType, ReviewType } from "../../../services/types";
import FocusedRestaurantReviewsList from "./FocusedRestaurantReviewsList";
import CustomRating from "../../reusableComponents/CustomRating";
import { useTranslation } from "react-i18next";
import Dialog from "../../reusableComponents/Dialog";
import FocusedRestaurantMenuList from "./FocusedRestaurantMenuList";
import CartContextProvider from "../../../contexts/CartContext";
import Visit from "../visits/Visit";
import EventCreationModal from "./../events/EventCreationModal";
import EventDetailsModal from "./../events/EventDetailsModal";

interface FocusedRestaurantDetailsProps {
  activeRestaurant: RestaurantDetailsType;
  onClose: () => void;
}

enum Options {
  "ORDER",
  "MENU",
  "EVENT",
  "VISIT",
}

const optionTitles: Record<Options, string> = {
  [Options.ORDER]: "Order",
  [Options.MENU]: "Menu",
  [Options.EVENT]: "Event",
  [Options.VISIT]: "Reservation",
};

const FocusedRestaurantDetails: React.FC<FocusedRestaurantDetailsProps> = ({
  activeRestaurant,
  onClose,
}) => {
  const [restaurant, setRestaurant] =
    useState<RestaurantDetailsType>(activeRestaurant);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [option, setOption] = useState<Options | null>(null);
  const [createdEventId, setCreatedEventId] = useState<number | null>(null);
  const [showMyEvents, setShowMyEvents] = useState<boolean>(false);

  const [t] = useTranslation("global");

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await fetchGET(
          `/restaurants/${activeRestaurant.restaurantId}`,
        );
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    const fetchRestaurantReviews = async () => {
      try {
        const data = await fetchGET(
          `/restaurants/${activeRestaurant.restaurantId}/reviews`,
        );
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

  const handleDialogClose = () => {
    setOption(null);
  };

  const handleEventCreationSuccess = (eventId: number) => {
    setCreatedEventId(eventId); // Przechowuje ID wydarzenia po sukcesie
    setOption(null); // Zamykamy dialog formularza tworzenia eventu
  };

  const handleShowMyEvents = () => {
    setShowMyEvents(true);
  };

  const renderRestaurantDetails = () => {
    return (
      <div className="flex w-full flex-col gap-2 p-3">
        <div className="flex w-full items-center justify-between gap-5">
          <h2 className="text-2xl font-bold dark:text-white">
            {restaurant.name}
          </h2>
          <div className="flex items-center gap-2 dark:text-white">
            <h1>{averageRating.toFixed(2)}</h1>
            <CustomRating rating={averageRating} readOnly={true} />
            <h1>({reviews.length})</h1>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-sm dark:text-white">
            {restaurant.address}, {restaurant.city}
          </h1>
          <div className="flex items-center gap-3 text-sm">
            {restaurant.provideDelivery && (
              <div className="flex items-center gap-2">
                <MopedIcon className="h-5 w-5 dark:text-white" />
                <h1 className="dark:text-white">
                  {t("home-page.delivery-fee")} 5,99 zł
                </h1>
              </div>
            )}
            <div className="flex items-center gap-1">
              <h1 className="dark:text-white">
                {t("home-page.is-delivering")}:
              </h1>
              {restaurant.provideDelivery ? (
                <CheckCircleIcon className="text-green-500 h-5 w-5 dark:text-white" />
              ) : (
                <CancelIcon className="text-red-500 h-5 w-5 dark:text-white" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDialogContent = {
    [Options.ORDER]: <></>,
    [Options.MENU]: (
      <FocusedRestaurantMenuList
        restaurant={activeRestaurant}
        reviews={reviews}
      />
    ),
    [Options.VISIT]: <Visit restaurant={activeRestaurant} />,
    [Options.EVENT]: (
      <EventCreationModal
        handleClose={handleDialogClose}
        restaurantId={restaurant.restaurantId}
        onSuccess={handleEventCreationSuccess}
      />
    ),
  };

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
            <div className="h-[250px] w-full">
              {restaurant && (
                <Carousel
                  images={[restaurant.logo, ...(restaurant.photos || [])]}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            {renderRestaurantDetails()}
            <span className="h-[1px] w-full bg-grey-1 dark:bg-grey-4"></span>
            <div className="flex w-full justify-around gap-2 rounded-lg p-3">
              <div className="flex h-full w-[70px] flex-col items-center gap-1">
                <button
                  className="h-12 w-12 rounded-full border-[1px] border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                  onClick={() => setOption(Options.VISIT)}
                >
                  <EditCalendarIcon className="h-6 w-6" />
                </button>
                <div className="flex h-[30px] items-center justify-center">
                  <h1 className="text-center text-[11px] text-primary dark:text-secondary">
                    {t("home-page.reservation")}
                  </h1>
                </div>
              </div>
              <div className="flex h-full w-[70px] flex-col items-center gap-1">
                <button
                  className="h-12 w-12 rounded-full border-[1px] border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                  onClick={() => setOption(Options.EVENT)}
                >
                  <EventIcon className="h-6 w-6" />
                </button>
                <div className="flex h-[30px] items-center justify-center">
                  <h1 className="text-center text-[11px] text-primary dark:text-secondary">
                    {t("home-page.create-event")}
                  </h1>
                </div>
              </div>
              <div className="flex h-full w-[70px] flex-col items-center gap-1">
                <button
                  className="h-12 w-12 rounded-full border-[1px] border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                  onClick={() => setOption(Options.MENU)}
                >
                  <RestaurantMenuIcon className="h-6 w-6" />
                </button>
                <div className="flex h-[30px] items-center justify-center">
                  <h1 className="text-center text-[11px] text-primary dark:text-secondary">
                    Menu
                  </h1>
                </div>
              </div>
              {restaurant.provideDelivery && (
                <div className="flex h-full w-[70px] flex-col items-center gap-1">
                  <button
                    className="h-12 w-12 rounded-full border-[1px] border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                    onClick={() => setOption(Options.ORDER)}
                  >
                    <DeliveryDiningIcon className="h-6 w-6" />
                  </button>
                  <div className="flex h-[30px] items-center justify-center">
                    <h1 className="text-center text-[11px] text-primary dark:text-secondary">
                      {t("home-page.order")}
                    </h1>
                  </div>
                </div>
              )}
            </div>
            <span className="h-[1px] w-full bg-grey-1 dark:bg-grey-4"></span>
            <div className="h-full p-3">
              <FocusedRestaurantReviewsList
                isPreview={false}
                reviews={reviews}
                activeRestaurantId={restaurant.restaurantId}
              />
            </div>
          </div>
        </>
      )}

      {option !== null && (
        <Dialog
          open={option !== null}
          onClose={handleDialogClose}
          title={optionTitles[option]}
        >
          {renderDialogContent[option]}
        </Dialog>
      )}

      {/*  EventDetailsModal tylko gdy jest createdEventId */}
      {createdEventId && (
        <EventDetailsModal
          eventId={createdEventId}
          open={true}
          onClose={() => setCreatedEventId(null)}
        />
      )}
    </>
  );
};

export default FocusedRestaurantDetails;
