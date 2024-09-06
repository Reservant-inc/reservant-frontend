import React, { useState, useEffect } from "react";
import RestaurantMenuView from "./RestaurantMenuView";
import RestaurantReviewsView from "./RestaurantReviewsView";
import RestaurantEventsView from "./RestaurantEventsView";
import { fetchGET, getImage } from "../../../../services/APIconn";
import {
  Box,
  Chip,
  ImageList,
  ImageListItem,
  Rating,
  Modal,
  Typography,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MopedIcon from "@mui/icons-material/Moped";
import { MenuItem } from "../../../../services/interfaces";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import CustomMarker from "../../../map/CustomMarker";
import DefaultPic from "../../../../assets/images/no-image.png"

const TABS = {
  MENU: "menu",
  EVENTS: "events",
  REVIEWS: "reviews",
};

interface RestaurantDetailsProps {
  addToCart: (item: MenuItem) => void;
  restaurantId: number | undefined;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  addToCart,
  restaurantId,
}) => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(TABS.MENU);
  const [openModal, setOpenModal] = useState(false);
  const [activeRestaurant, setActiveRestaurant] = useState<any>(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await fetchGET(`/restaurants/${restaurantId}`);
        setRestaurant(data);
        setActiveRestaurant(data);
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
      case TABS.MENU:
        return (
          <RestaurantMenuView
            addToCart={addToCart}
            restaurantId={restaurant.restaurantId}
          />
        );
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
          <RestaurantMenuView
            addToCart={addToCart}
            restaurantId={restaurant.restaurantId}
          />
        );
    }
  };

  const center: [number, number] = [
    restaurant.location.latitude,
    restaurant.location.longitude,
  ];
  const zoom = 17;

  const MapViewUpdater = () => {
    const map = useMap();

    useEffect(() => {
      map.setMinZoom(15);
      map.setMaxZoom(18);
      map.setView(center, zoom);
    }, [center, map]);

    map.on("zoomend", () => {
      map.setView(center, map.getZoom());
    });

    return null;
  };

  return (
    <div className="mx-auto mt-10 flex flex-col space-y-5 rounded-xl bg-grey-1 lg:mx-40 lg:mt-20">
      <div className="relative mb-40 border-l-4 border-r-4 border-t-4 border-primary lg:mb-32">
        <Box
          component="img"
          src={getImage(restaurant.logo as string, DefaultPic)}
          alt="Restaurant logo"
          className="w-full object-cover lg:h-96"
        />
        <div className="absolute left-1/2 top-[90%] w-4/5 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border-2 border-primary bg-white px-4 py-4 shadow-lg lg:w-1/3 lg:px-10 lg:py-6">
          <h2 className="text-center text-2xl font-extrabold text-primary-2 lg:text-3xl">
            {restaurant.name}
          </h2>
          <div className="my-2 flex items-center justify-center space-x-2 lg:my-3">
            <Rating
              name="read-only"
              value={4.5} // placeholder
              precision={0.5}
              readOnly
              emptyIcon={
                <StarBorderIcon
                  fontSize="inherit"
                  className="text-grey-2 dark:text-grey-1"
                />
              }
            />
            <div>(200+ opinii)</div> {/* placeholder */}
          </div>
          {restaurant.provideDelivery ? (
            <div className="my-2 flex items-center justify-center space-x-2 lg:my-3">
              <MopedIcon />
              <div>Koszt dostawy 5,99 zł</div>
            </div>
          ) : (
            <div className="my-2 flex items-center justify-center space-x-2 lg:my-3">
              <MopedIcon />
              <div>Nie zapewnia dostawy</div>
            </div>
          )}
          <div className="mt-2 text-center lg:mt-3">{restaurant.address}</div>
          <div className="text-center">{restaurant.postalIndex}</div>
          <div className="text-center">{restaurant.city}</div>
          <div className="my-2 text-center lg:my-3">
            {restaurant.restaurantType}
          </div>
          <div className="my-2 flex flex-wrap justify-center gap-1 lg:my-3">
            {restaurant.tags?.map((tag: string, index: number) => (
              <Chip
                key={index}
                label={tag}
                style={{
                  backgroundColor: "#e0f7fa",
                  color: "#00796b",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="relative mx-4 mb-40 mt-64 h-80 overflow-hidden rounded-lg border-2 border-primary bg-grey-2 lg:mx-10 lg:mb-32 lg:mt-56">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          dragging={false}
          doubleClickZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CustomMarker
            position={center}
            restaurant={restaurant}
            activeRestaurant={activeRestaurant}
            setActiveRestaurant={setActiveRestaurant}
          />
          <MapViewUpdater />
        </MapContainer>
      </div>
      <div className="mb-10 flex w-full justify-center text-8xl text-primary lg:mb-8">
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Galeria
        </Typography>
      </div>
      <div className="mb-20 flex w-full justify-center lg:mb-16">
        {renderGallery()}
      </div>
      <div className="mb-20 flex justify-center space-x-10 px-6 lg:mb-16">
        <h3
          className={`cursor-pointer py-3 ${
            activeTab === TABS.MENU
              ? "text-2xl font-extrabold text-primary underline"
              : "text-2xl text-grey-5"
          }`}
          onClick={() => setActiveTab(TABS.MENU)}
        >
          Menu
        </h3>
        <h3
          className={`cursor-pointer py-3 ${
            activeTab === TABS.EVENTS
              ? "text-2xl font-extrabold text-primary underline"
              : "text-2xl text-grey-5"
          }`}
          onClick={() => setActiveTab(TABS.EVENTS)}
        >
          Wydarzenia
        </h3>
        <h3
          className={`cursor-pointer py-3 ${
            activeTab === TABS.REVIEWS
              ? "text-2xl font-extrabold text-primary underline"
              : "text-2xl text-grey-5"
          }`}
          onClick={() => setActiveTab(TABS.REVIEWS)}
        >
          Oceny
        </h3>
      </div>
      <div className="px-6 pb-6">{renderActiveTab()}</div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 2 }}
            className="font-bold text-primary"
          >
            Galeria
          </Typography>
          <ImageList sx={{ width: "100%", height: "auto" }} cols={1} gap={8}>
            {restaurant.photos?.map((img: string, index: number) => (
              <ImageListItem key={index}>
                <img
                  srcSet={getImage(
                    `${img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x` as string, DefaultPic
                  )}
                  src={getImage(
                    `${img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x` as string, DefaultPic
                  )}
                  alt={`Restaurant image ${index + 1}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Modal>
    </div>
  );
};

export default RestaurantDetails;
