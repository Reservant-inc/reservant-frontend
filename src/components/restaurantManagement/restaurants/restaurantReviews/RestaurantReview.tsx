import React, { useState } from "react";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Rating } from "@mui/material";
import CustomRating from "../../../reusableComponents/CustomRating";
import { ReviewType } from "../../../../services/types";
import { fetchPUT } from "../../../../services/APIconn"; // Assumes fetchPUT is a defined helper for PUT requests

interface RestaurantReviewProps {
  review: ReviewType;
  refreshReviews: () => void; // Function to refresh reviews after edit
}

const RestaurantReview: React.FC<RestaurantReviewProps> = ({ review, refreshReviews }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedStars, setEditedStars] = useState<number>(review.stars);
  const [editedContents, setEditedContents] = useState<string>(review.contents);

  const reducedDescription =
    review.contents.length > 100 ? review.contents.substring(0, 100) + "..." : review.contents;

  // Open dialog for editing
  const handleEditClick = () => {
    setEditedStars(review.stars);
    setEditedContents(review.contents);
    setIsEditDialogOpen(true);
  };

  // Close dialog without saving
  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  // Save edited review
  const handleSaveEdit = async () => {
    try {
      const updatedReview = {
        stars: editedStars,
        contents: editedContents,
      };
      await fetchPUT(`/reviews/${review.reviewId}`, JSON.stringify(updatedReview));
      refreshReviews(); // Refresh reviews list after saving
      setIsEditDialogOpen(false); // Close dialog
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div className="flex h-[10rem] flex-col justify-between gap-2 rounded-lg border-grey-0 p-2 dark:bg-grey-6 bg-grey-0">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8">A</Avatar>
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
        <Button
          id="RestaurantReviewMoreButton"
          className="rounded-lg text-primary dark:text-secondary"
        >
          Respond
        </Button>
        <Button
          id="RestaurantReviewEditButton"
          className="rounded-lg text-primary dark:text-secondary"
          onClick={handleEditClick} // Open edit dialog
        >
          Edit
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Rating
            name="star-rating-edit"
            value={editedStars}
            onChange={(event, newValue) => setEditedStars(newValue || review.stars)}
          />
          <textarea
            rows={4}
            value={editedContents}
            onChange={(e) => setEditedContents(e.target.value)}
            className="w-full p-4 border rounded dark:bg-grey-6 dark:text-white dark:border-grey-4"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} className="text-primary dark:text-secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} className="text-primary dark:text-secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RestaurantReview;
