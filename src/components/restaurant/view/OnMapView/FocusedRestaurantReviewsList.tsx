import React, { useState, useEffect } from "react";
import RestaurantReviewsFilters from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReviewsFilters";
import RestaurantReview from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReview";
import RestaurantReviewForm from "../RestaurantReviewForm";
import { Button, Modal, Box } from "@mui/material";
import { fetchGET } from "../../../../services/APIconn";

interface FocusedRestaurantReviewsListProps {
  isPreview: boolean;
  reviews: any[];
}

const FocusedRestaurantReviewsList: React.FC<
  FocusedRestaurantReviewsListProps
> = ({ isPreview, reviews }) => {
  const [filteredReviews, setFilteredReviews] = useState<any[]>(reviews); //ReviewType
  const [sort, setSort] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setFilteredReviews(reviews);
  }, [reviews]);

  const handleSort = (reviews: any[]) => {
    switch (sort) {
      case "1": // od najnowszych
        return reviews.sort(
          (a, b) =>
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
        );
      case "2": // ascending
        return reviews.sort((a, b) => a.stars - b.stars);
      case "3": // descending
        return reviews.sort((a, b) => b.stars - a.stars);
      default:
        return reviews;
    }
  };

  const filteredAndSortedReviews =
    filterText.length >= 3
      ? handleSort(
          filteredReviews.filter((review) =>
            review.contents?.toLowerCase().includes(filterText.toLowerCase()),
          ),
        )
      : handleSort(filteredReviews);

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg dark:text-grey-1">
      <div className="flex h-full w-full flex-col gap-2">
        {!isPreview && (
          <>
            <RestaurantReviewsFilters
              sort={sort}
              setSort={setSort}
              filterText={filterText}
              setFilterText={setFilterText}
            />
            <Button
              variant="contained"
              style={{ backgroundColor: "#a94c79", color: "#fefefe" }}
              onClick={() => setIsModalOpen(true)}
            >
              + Dodaj opinię
            </Button>
          </>
        )}
        <div className="scroll h-full w-full overflow-y-auto">
          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map((review) => (
              <RestaurantReview key={review.reviewId} {...review} />
            ))
          ) : (
            <div className="mt-4 text-center">
              No matching reviews for this restaurant.
            </div>
          )}
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <RestaurantReviewForm
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => alert("kurwa")}
          />
        </Box>
      </Modal>
    </div>
  );
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  color: "#000",
  bgcolor: "#fff",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

export default FocusedRestaurantReviewsList;
