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
import {
  fetchPUT,
  fetchDELETE,
  fetchGET,
  getImage,
} from "../../../../services/APIconn"; // Import getImage
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "../../../reusableComponents/ConfirmationDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface RestaurantReviewProps {
  review: ReviewType;
  refreshReviews: () => void;
  user: User | null;
}

const RestaurantReview: React.FC<RestaurantReviewProps> = ({
  review,
  refreshReviews,
  user,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedStars, setEditedStars] = useState<number>(review.stars);
  const [editedContents, setEditedContents] = useState<string>(review.contents);
  const [authorData, setAuthorData] = useState<User | null>(null);

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

  const reducedDescription =
    review.contents.length > 100
      ? review.contents.substring(0, 100) + "..."
      : review.contents;

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
      await fetchPUT(
        `/reviews/${review.reviewId}`,
        JSON.stringify(updatedReview),
      );
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
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="flex h-[10rem] flex-col justify-between gap-2 rounded-lg border-grey-0 bg-grey-0 p-2 dark:bg-grey-6">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={getImage(
              authorData?.photo || "",
              "/path/to/default/avatar.png",
            )}
            alt={authorData?.login}
          >
            {authorData
              ? `${authorData.firstName.charAt(0)}${authorData.lastName.charAt(0)}`
              : "A"}
          </Avatar>
          <p>{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <CustomRating rating={review.stars} readOnly={true} />
      </div>
      <div className="flex flex-col items-start">
        {reducedDescription.replace(/\s/g, "").length > 0 ? (
          <p>{reducedDescription}</p>
        ) : (
          <p className="italic">No description.</p>
        )}
      </div>
      <div className="flex w-full justify-end gap-2">
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
      </div>

      <Dialog open={isEditDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{t("reviews.edit-review")}</DialogTitle>
        <DialogContent>
          <h2>{t("reviews.rating")}:</h2>
          <Rating
            name="star-rating-edit"
            value={editedStars}
            onChange={(event, newValue) =>
              setEditedStars(newValue || review.stars)
            }
          />
          <textarea
            rows={4}
            value={editedContents}
            onChange={(e) => setEditedContents(e.target.value)}
            className="w-full rounded border p-4 dark:border-grey-4 dark:bg-grey-6 dark:text-white"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            className="text-primary dark:text-secondary"
          >
            {t("general.cancel")}
          </Button>
          <Button
            onClick={handleSaveEdit}
            className="text-primary dark:text-secondary"
          >
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
