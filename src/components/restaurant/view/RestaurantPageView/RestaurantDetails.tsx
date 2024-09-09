import React, { useState, useEffect } from "react";
import RestaurantMenuView from "./RestaurantMenuView";
import RestaurantReviewsView from "./RestaurantReviewsView";
import RestaurantEventsView from "./RestaurantEventsView";
import { fetchGET, getImage } from "../../../../services/APIconn";
import {
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import DefaultPic from "../../../../assets/images/no-image.png"

const TABS = {
  MENU: "MENU",
  EVENTS: "EVENTS",
  REVIEWS: "REVIEWS",
};

interface RestaurantDetailsProps {
  restaurantId: number | undefined;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  restaurantId,
}) => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(TABS.MENU);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await fetchGET(`/restaurants/${restaurantId}`);
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  useEffect(() => {
    if (activeTab === TABS.EVENTS) {
      const fetchRestaurantEvents = async () => {
        try {
          const data = await fetchGET(`/restaurants/${restaurantId}/events`);
          setEvents(data.items || []);
        } catch (error) {
          console.error("Error fetching restaurant events:", error);
        }
      };

      fetchRestaurantEvents();
    }
  }, [activeTab, restaurantId]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  const renderGallery = () => {
    if (!restaurant.photos || restaurant.photos.length === 0) {
      return (
        <div className="mx-4 flex h-40 w-full items-center justify-center rounded-lg border-2 border-primary bg-grey-1 italic text-grey-5 lg:mx-10">
          <Typography variant="h5" component="div">
            {restaurant.name} nie posiada jeszcze żadnych zdjęć.
          </Typography>
        </div>
      );
    }

    return (
      <div className="mx-4 rounded-lg border-2 border-primary p-4 lg:mx-10">
        <ImageList sx={{ width: "100%", height: 400 }} cols={4} gap={8}>
          {restaurant.photos.slice(0, 3).map((img: string, index: number) => (
            <ImageListItem key={index} sx={{ width: "100%", height: "100%" }}>
              <img
                className="bg-grey-2"
                srcSet={getImage(
                  `${img}?w=400&h=400&fit=crop&auto=format&dpr=2 2x` as string, DefaultPic
                )}
                src={getImage(
                  `${img}?w=400&h=400&fit=crop&auto=format&dpr=2 2x` as string, DefaultPic
                )}
                alt={`Restaurant image ${index + 1}`}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </ImageListItem>
          ))}
          {restaurant.photos.length > 4 && (
            <ImageListItem
              key="show-more"
              onClick={handleOpenModal}
              sx={{
                cursor: "pointer",
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <img
                className="bg-grey-2"
                srcSet={getImage(
                  `${restaurant.photos[3]}?w=400&h=400&fit=crop&auto=format&dpr=2 2x` as string, DefaultPic
                )}
                src={getImage(
                  `${restaurant.photos[3]}?w=400&h=400&fit=crop&auto=format&dpr=2 2x` as string, DefaultPic
                )}
                alt="Show more"
                loading="lazy"
                style={{
                  filter: "grayscale(100%)",
                  opacity: 0.8,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Typography variant="h5" className="font-bold text-black">
                  Wyświetl Galerię
                </Typography>
              </div>
            </ImageListItem>
          )}
        </ImageList>
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case TABS.EVENTS:
        return (
          <RestaurantEventsView
            restaurantId={restaurant.restaurantId}
            events={events}
            restaurantName={restaurant.name}
          />
        );
      case TABS.REVIEWS:
        return <RestaurantReviewsView />;
      default:
      return (
        <></>
        );
    }
  };

  return (
    <div>

    </div>
  );
};

export default RestaurantDetails;
