import React, { useEffect, useState } from "react";
import { fetchGET } from "../../../../services/APIconn";
import {
  Chip,
  Rating,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MopedIcon from "@mui/icons-material/Moped";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Carousel from "../../../reusableComponents/ImageCarousel/Carousel";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import CustomMarker from "../../../map/CustomMarker";
import { RestaurantDetailsType, RestaurantType } from "../../../../services/types";

const TABS = {
  MENU: "menu",
  GALLERY: "gallery",
  REVIEWS: "reviews",
};

interface FocusedRestaurantDetailsProps {
  activeRestaurant: RestaurantDetailsType;
  onClose: () => void;
}

const getOpinionsText = (count: number) => {
  if (count === 1) return `${count} opinia`;
  if (count > 1 && count < 5) return `${count} opinie`;
  return `${count} opinii`;
};

const FocusedRestaurantDetails: React.FC<FocusedRestaurantDetailsProps> = ({
  activeRestaurant,
  onClose,
}) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>(activeRestaurant);  //ResturantType
  const [reviews, setReviews] = useState<any[]>([]);

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
  }, [activeRestaurant.restaurantId]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
    : 0;

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
    <>
      {!restaurant ? (
        <CircularProgress className="h-8 w-8 text-grey-0" />
      ) : (
        <>
          <div className="relative">
            <IconButton
              onClick={onClose}
              className="absolute right-2 top-2 z-10 h-8 w-8 bg-white"
            >
              <CloseIcon />
            </IconButton>
            <div className="w-full h-48">
              <Carousel images={[restaurant.logo, ...restaurant.photos]}/>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <div className="flex gap-5 items-center w-full justify-between">
              <h2 className="text-2xl font-bold">{restaurant.name}</h2>
              <div className="flex items-center gap-2">
                <h1>
                  {averageRating.toFixed(2)}
                </h1>
                <Rating
                  name="read-only"
                  value={averageRating}
                  precision={0.25}
                  readOnly
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
                <h1>
                  ({getOpinionsText(reviews.length)})
                </h1>
              </div>
            </div>
            <h1 className="text-sm">
              {restaurant.address}, {restaurant.city}
            </h1>
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
              <MapViewUpdater />
            </MapContainer>
            <div className="my-3 flex items-center">
              {restaurant.provideDelivery && (
                <>
                  <MopedIcon />{" "}
                  <h1 className="ml-2">
                    Koszt dostawy 5,99 zł
                  </h1>
                </>
              )}
              <h1 className="ml-2">
                Dostawa:{" "}
                {restaurant.provideDelivery ? (
                  <CheckCircleIcon className="text-green-500" />
                ) : (
                  <CancelIcon className="text-red-500" />
                )}
              </h1>
            </div>
            <div className="my-3 flex flex-wrap gap-1">
              {restaurant.tags.map((tag: string) => (
                <Chip
                  key={tag}
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
        </>
      )}
    </>
  );
};

export default FocusedRestaurantDetails;
