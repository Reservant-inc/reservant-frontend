import React, { useState, useEffect } from "react";
import RestaurantReviewsFilters from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReviewsFilters";
import RestaurantReview from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReview";
import RestaurantReviewForm from "../RestaurantReviewForm";
import { Button, Modal, Box } from "@mui/material";
import { ReviewType } from "../../../../services/types";

interface FocusedRestaurantReviewsListProps {
  isPreview: boolean;
  reviews: any[];
}

const FocusedRestaurantReviewsList: React.FC<
  FocusedRestaurantReviewsListProps
> = ({ isPreview, reviews }) => {
  const [filteredReviews, setFilteredReviews] = useState<ReviewType[]>(reviews);
  const [sort, setSort] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");

  useEffect(() => {
    setFilteredReviews(reviews);
  }, [reviews]);

  const handleSort = (reviews: any[]) => {
    switch (sort) {
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
            <Button
              className=""
            >
              + Dodaj opinię
            </Button>
            <RestaurantReviewsFilters
              sort={sort}
              setSort={setSort}
              filterText={filterText}
              setFilterText={setFilterText}
            />
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
      <dialog>

      </dialog>
    </div>
  );
};

export default FocusedRestaurantReviewsList;
