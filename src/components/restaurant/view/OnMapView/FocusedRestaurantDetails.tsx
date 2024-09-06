import React, { useEffect, useState } from "react";
import { fetchGET, getImage } from "../../../../services/APIconn";
import {
  Box,
  Chip,
  Rating,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MopedIcon from "@mui/icons-material/Moped";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DefaultPic from "../../../../assets/images/no-image.png"

const TABS = {
  MENU: "menu",
  GALLERY: "gallery",
  REVIEWS: "reviews",
};

interface FocusedRestaurantDetailsProps {
  restaurantId: number;
  onClose: () => void;
  setIsRestaurantViewExtended: Function
}

const getOpinionsText = (count: number) => {
  if (count === 1) return `${count} opinia`;
  if (count > 1 && count < 5) return `${count} opinie`;
  return `${count} opinii`;
};

const FocusedRestaurantDetails: React.FC<FocusedRestaurantDetailsProps> = ({
  restaurantId,
  onClose,
  setIsRestaurantViewExtended
}) => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await fetchGET(`/restaurants/${restaurantId}`);
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    const fetchRestaurantReviews = async () => {
      try {
        const data = await fetchGET(`/restaurants/${restaurantId}/reviews`);
        setReviews(data.items || []);
      } catch (error) {
        console.error("Error fetching restaurant reviews:", error);
      }
    };

    fetchRestaurantDetails();
    fetchRestaurantReviews();
  }, [restaurantId]);

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
              className="absolute right-2 top-2 z-10 h-8 w-8 bg-white"
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={getImage(restaurant.logo as string, DefaultPic)}
              alt="Restaurant"
              className="h-50 w-full object-cover rounded-lg"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold">{restaurant.name}</h2>
            <div className="my-3 flex items-center space-x-2">
              <Rating
                name="read-only"
                value={averageRating}
                precision={0.25}
                readOnly
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
              <Typography variant="body2">
                {averageRating.toFixed(2)} ({getOpinionsText(reviews.length)})
              </Typography>
            </div>
            <Typography variant="body2" className="my-1">
              {restaurant.address}, {restaurant.city}
            </Typography>
            <Typography variant="body2" className="my-1">
              {restaurant.restaurantType}
            </Typography>
            <div className="my-3 flex items-center">
              {restaurant.provideDelivery && (
                <>
                  <MopedIcon />{" "}
                  <Typography variant="body2" className="ml-2">
                    Koszt dostawy 5,99 zł
                  </Typography>
                </>
              )}
              <Typography variant="body2" className="ml-2">
                Dostawa:{" "}
                {restaurant.provideDelivery ? (
                  <CheckCircleIcon className="text-green-500" />
                ) : (
                  <CancelIcon className="text-red-500" />
                )}
              </Typography>
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
            <div className="mt-4 flex justify-between">
              <Button
                variant="contained"
                style={{ backgroundColor: "#a94c79", color: "#fefefe" }}
                onClick={() => setIsRestaurantViewExtended(true)}
              >
                Przejdź do strony restauracji
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FocusedRestaurantDetails;
