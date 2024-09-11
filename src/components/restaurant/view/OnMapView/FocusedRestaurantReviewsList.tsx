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
        <div className="w-full h-[50px] rounded-lg flex gap-2">
          <button className="dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary w-full transition hover:scale-105">
            Zarezerwuj
          </button>
          <button className="dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary w-full transition hover:scale-105">
            Stwórz event
          </button>
          <button className="dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary w-full transition hover:scale-105">
            Zamów
          </button>
        </div>
        <h1 className="text-2xl font-mont-bd text-black dark:text-white">Menu:</h1>
        <div className="w-full h-[150px] dark:bg-grey-5 rounded-lg">
        </div>
        <div className="scroll flex flex-col gap-2 h-full w-full overflow-y-auto">
          <h1 className="text-2xl font-mont-bd text-black dark:text-white">Reviews:</h1>
          {!isPreview && (
            <div className="flex w-full gap-2">
              <RestaurantReviewsFilters
                sort={sort}
                setSort={setSort}
                filterText={filterText}
                setFilterText={setFilterText}
              />
              <Button
                className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary dark:text-secondary dark:hover:bg-grey-6 hover:bg-white"
              >
                + Dodaj opinię
              </Button>
            </div>
          )}
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
