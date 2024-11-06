import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
} from "@mui/material";
import CustomRating from "../../../reusableComponents/CustomRating";
import { ReviewType, User } from "../../../../services/types";
import { fetchPUT, fetchDELETE, fetchGET, getImage } from "../../../../services/APIconn";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "../../../reusableComponents/ConfirmationDialog";

interface RestaurantReviewProps {
  review: ReviewType;
  refreshReviews: () => void;
  user: User | null;
  onReviewDeleted?: () => void;
  isOwnerView?: boolean;
  restaurantId: number;
}

const RestaurantReview: React.FC<RestaurantReviewProps> = ({
  review,
  refreshReviews,
  user,
  onReviewDeleted,
  isOwnerView,
  restaurantId,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRespondDialogOpen, setIsRespondDialogOpen] = useState(false);
  const [editedStars, setEditedStars] = useState<number>(review.stars);
  const [editedContents, setEditedContents] = useState<string>(review.contents);
  const [responseContents, setResponseContents] = useState<string>(review.restaurantResponse || "");
  const [authorData, setAuthorData] = useState<User | null>(user);
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false); // State for expansion

  const [t] = useTranslation("global");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchGET(`/users/${review.authorId}`);
        setAuthorData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [review.authorId]);

  useEffect(() => {
    if (review.restaurantResponse) {
      const fetchRestaurantLogo = async () => {
        try {
          const restaurantData = await fetchGET(`/restaurants/${restaurantId}`);
          setRestaurantLogo(restaurantData.logo || null);
        } catch (error) {
          console.error("Error fetching restaurant logo:", error);
        }
      };
      fetchRestaurantLogo();
    }
  }, [review.restaurantResponse, restaurantId]);

  const handleEditClick = () => {
    setEditedStars(review.stars);
    setEditedContents(review.contents);
    setIsEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedReview = {
        stars: editedStars,
        contents: editedContents,
      };
      await fetchPUT(`/reviews/${review.reviewId}`, JSON.stringify(updatedReview));
      refreshReviews();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await fetchDELETE(`/reviews/${review.reviewId}`);
      refreshReviews();
      onReviewDeleted && onReviewDeleted();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleRespondClick = () => {
    setIsRespondDialogOpen(true);
  };

  

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // Toggle the expansion state
  };

  const handleSaveResponse = async () => {
  try {
    const responseBody = {
      response: responseContents, // restaurant's response content
    };

    await fetchPUT(`/reviews/${review.reviewId}/restaurant-response`, JSON.stringify(responseBody));

    // Close the dialog and refresh the reviews
    setIsRespondDialogOpen(false);
    refreshReviews();

  } catch (error) {
    console.error("Error saving restaurant response:", error);
  }
};


  return (
    <div className="flex flex-col gap-1 p-2 rounded-lg dark:bg-grey-6 bg-grey-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <Avatar
            src={getImage(authorData?.photo || "", "/path/to/default/avatar.png")}
            alt={authorData?.login}
            className="h-7 w-7"
            >
            <h1 className="text-sm">
              {
                authorData
                ? `${authorData.firstName.charAt(0)}${authorData.lastName.charAt(0)}`
                : "A"
              }
            </h1>
          </Avatar>
          <p className="text-sm">{authorData?.firstName + ' ' + authorData?.lastName}</p>
          <p className="text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <CustomRating rating={review.stars} readOnly={true} className="text-[20px]"/>
      </div>

      <div className="review-content flex flex-col items-start p-1">
        <p>
          <h1 className="text-sm">
            {isExpanded || review.contents.length <= 100
              ? review.contents
              : `${review.contents.substring(0, 100)}...`}
          </h1>
          {review.contents.length > 100 && !isExpanded && (
            <span
              className="text-grey-2 cursor-pointer text-sm"
              onClick={toggleExpand}
            >
              {t("general.read-more")}
            </span>
          )}
          {isExpanded && (
            <span
              className="text-grey-2 cursor-pointer text-sm"
              onClick={toggleExpand}
            >
              {t("general.read-less")}
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center">
        {review.dateEdited && (
          <span className="flex-grow italic text-xs text-grey-3">
            {t("reviews.edited-at")}: {new Date(review.dateEdited).toLocaleDateString()}
          </span>
        )}
        <div className="review-actions flex items-center gap-1 ml-auto">
          {review.authorId === user?.userId && (
            <>
              <Button
                id="RestaurantReviewEditButton"
                className="rounded-lg text-primary dark:text-secondary"
                onClick={handleEditClick}
              >
                {t("general.edit")}
              </Button>
              <Button
                id="RestaurantReviewDeleteButton"
                className="rounded-lg text-primary dark:text-secondary"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                {t("general.delete")}
              </Button>
            </>
          )}
          {user?.roles?.includes("RestaurantOwner") && isOwnerView && (
            <Button
              onClick={handleRespondClick}
              className="text-primary dark:text-secondary"
            >
              {review.restaurantResponse ? "" : t("reviews.respond")}
            </Button>
          )}
        </div>
      </div>

      {review.restaurantResponse && (
        <div className="bg-grey-1 dark:bg-grey-5 response-section p-4 rounded-lg border-l-4 border-primary dark:border-secondary flex items-start gap-4">
          <Avatar src={getImage(restaurantLogo || "", "/path/to/default/logo.png")} alt="Restaurant Logo" />
          <div className="response-content flex-grow">
            <p>{new Date(review.answeredAt).toLocaleDateString()}</p>
            <p>{review.restaurantResponse}</p>
            <div className="flex mt-2 justify-end">
              <Button
                onClick={handleRespondClick}
                className="text-primary dark:text-secondary pb-0"
              >
                {t("reviews.edit-response")}
              </Button>
            </div>
          </div>
        </div>
      )}


      <Dialog open={isEditDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{t("reviews.edit-review")}</DialogTitle>
        <DialogContent>
          <h2>{t("reviews.rating")}:</h2>
          <Rating
            name="star-rating-edit"
            value={editedStars}
            onChange={(event, newValue) => setEditedStars(newValue || review.stars)}
          />
          <textarea
            rows={4}
            value={editedContents}
            onChange={(e) => setEditedContents(e.target.value)}
            className="w-full p-4 border rounded dark:bg-grey-700 dark:text-white dark:border-grey-500"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} className="text-primary dark:text-secondary">
            {t("general.cancel")}
          </Button>
          <Button onClick={handleSaveEdit} className="text-primary dark:text-secondary">
            {t("general.save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isRespondDialogOpen} onClose={() => setIsRespondDialogOpen(false)}>
        <DialogTitle>{t("reviews.add-response")}</DialogTitle>
        <DialogContent>
          <textarea
            rows={4}
            value={responseContents}
            onChange={(e) => setResponseContents(e.target.value)}
            className="w-[400px] p-4 border rounded dark:bg-grey-700 dark:text-white dark:border-grey-500"
            placeholder={t("reviews.response-placeholder")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRespondDialogOpen(false)} className="text-primary dark:text-secondary">
            {t("general.cancel")}
          </Button>
          <Button onClick={handleSaveResponse} className="text-primary dark:text-secondary">
            {t("general.save")}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteReview}
        confirmationText={t("reviews.review-delete")}
      />
    </div>
  );
};

export default RestaurantReview;
