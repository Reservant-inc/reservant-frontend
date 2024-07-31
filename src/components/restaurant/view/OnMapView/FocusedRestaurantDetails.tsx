import React, { useEffect, useState } from "react";
import { fetchGET, getImage } from "../../../../services/APIconn";
import {
  Box,
  Chip,
  Rating,
  Button,
  IconButton,
  Typography,
  ImageList,
  ImageListItem,
  Modal,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MopedIcon from "@mui/icons-material/Moped";
import { useNavigate } from "react-router-dom";
import FocusedRestaurantReviewsList from "./FocusedRestaurantReviewsList";
import FocusedRestaurantMenuList from "./FocusedRestaurantMenuList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const TABS = {
  MENU: "menu",
  GALLERY: "gallery",
  REVIEWS: "reviews",
};

interface FocusedRestaurantDetailsProps {
  restaurantId: number;
  onClose: () => void;
}

const getOpinionsText = (count: number) => {
  if (count === 1) return `${count} opinia`;
  if (count > 1 && count < 5) return `${count} opinie`;
  return `${count} opinii`;
};

const FocusedRestaurantDetails: React.FC<FocusedRestaurantDetailsProps> = ({
  restaurantId,
  onClose,
}) => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(TABS.MENU);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const navigate = useNavigate();

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

  const renderActiveTab = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <div className="p-4">
            <ImageList variant="masonry" cols={3} gap={8}>
              {restaurant.photos.map((photo: string, index: number) => (
                <ImageListItem
                  key={index}
                  onClick={() => setSelectedImage(getImage(photo as string))}
                >
                  <img
                    src={`${getImage(photo as string)}?w=248&fit=crop&auto=format`}
                    srcSet={`${getImage(photo as string)}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={`Gallery photo ${index + 1}`}
                    loading="lazy"
                    style={{ borderRadius: "8px", cursor: "pointer" }}
                  />
                </ImageListItem>
              ))}
            </ImageList>

            <Modal
              open={!!selectedImage}
              onClose={() => setSelectedImage(null)}
            >
              <Box
                sx={{
                  position: "absolute" as "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 0,
                  maxWidth: "90%",
                  maxHeight: "90%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={selectedImage || ""}
                  alt="Selected"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Modal>
          </div>
        );
      case TABS.REVIEWS:
        return (
          <div className="h-full w-full overflow-y-auto p-4">
            <FocusedRestaurantReviewsList isPreview={false} reviews={reviews} />
          </div>
        );
      case TABS.MENU:
      default:
        return (
          <div className="h-full w-full overflow-y-auto p-4">
            <FocusedRestaurantMenuList restaurantId={restaurantId} />
          </div>
        );
    }
  };

  const handleRestaurantPageRedirect = () => {
    navigate(`/restaurants/${restaurantId}`);
  };

  return (
    <div className="absolute left-[370px] top-[70px] z-[1] h-[calc(95%-50px)] w-[400px] overflow-y-auto rounded-lg bg-white shadow-md scroll">
      {!restaurant ? (
        <CircularProgress className="text-grey-0 h-8 w-8"/>
      ) : (
      <>

        <div className="relative">
          <IconButton
            onClick={onClose}
            className="absolute right-2 top-2 z-10 bg-white h-8 w-8"
          >
            <CloseIcon />
          </IconButton>
          <Box
          component="img"
          src={getImage(restaurant.logo as string)}
          alt="Restaurant"
          className="h-50 w-full object-cover"
          />
        </div>
        <div className="h-full p-4">
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
              onClick={handleRestaurantPageRedirect}
            >
              Przejdź do strony restauracji
            </Button>
          </div>
          <div className="mt-4 flex space-x-4">
            <Typography
              variant="body2"
              className={`cursor-pointer ${
                activeTab === TABS.MENU
                  ? "text-primary-2 underline"
                  : "text-grey-2"
              }`}
              onClick={() => setActiveTab(TABS.MENU)}
            >
              Menu
            </Typography>
            <Typography
              variant="body2"
              className={`cursor-pointer ${
                activeTab === TABS.GALLERY
                  ? "text-primary-2 underline"
                  : "text-grey-2"
              }`}
              onClick={() => setActiveTab(TABS.GALLERY)}
            >
              Galeria
            </Typography>
            <Typography
              variant="body2"
              className={`cursor-pointer ${
                activeTab === TABS.REVIEWS
                  ? "text-primary-2 underline"
                  : "text-grey-2"
              }`}
              onClick={() => setActiveTab(TABS.REVIEWS)}
            >
              Opinie
            </Typography>
          </div>
          {renderActiveTab()}
        </div>
      </>
      )}
    </div>
  );
};

export default FocusedRestaurantDetails;
