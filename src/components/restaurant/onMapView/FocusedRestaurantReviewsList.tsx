import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Pagination,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Check as CheckIcon,
  SwapVert as SwapVertIcon,
} from "@mui/icons-material";
import { fetchGET, fetchPOST } from "../../../services/APIconn";
import { ReviewType, User } from "../../../services/types";
import RestaurantReview from "../../restaurantManagement/restaurants/restaurantReviews/RestaurantReview";
import RestaurantReviewsFilters from "../../restaurantManagement/restaurants/restaurantReviews/RestaurantReviewsFilters";

interface FocusedRestaurantReviewsListProps {
  isPreview: boolean;
  reviews: ReviewType[];
  isDelivering: boolean;
  restaurantId: number;
}

const FocusedRestaurantReviewsList: React.FC<
  FocusedRestaurantReviewsListProps
> = ({ isPreview, reviews, isDelivering, restaurantId }) => {
  const [filteredAndSortedReviews, setFilteredAndSortedReviews] = useState<
    ReviewType[]
  >([]);
  const [ratingFilter, setRatingFilter] = useState<number>(0); // Track selected rating filter
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [starRating, setStarRating] = useState<number | null>(0);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [t] = useTranslation("global");

  // Function to fetch reviews with filtering and sorting applied
  const fetchReviews = async () => {
    try {
      // Fetch data from API with the selected sort order and page settings
      const data = await fetchGET(
        `/restaurants/${restaurantId}/reviews?page=${currentPage - 1}&perPage=${perPage}&orderBy=${
          sortOrder === "asc" ? "DateAsc" : "DateDesc"
        }`,
      );

      // Apply local filter for star rating
      const filteredReviews = data.items?.filter((review: ReviewType) => {
        return ratingFilter === 0 || review.stars === ratingFilter;
      });

      setFilteredAndSortedReviews(filteredReviews || []);
      setTotalPages(data.totalPages || 0);
      console.log(data);
    } catch (error) {
      console.error("Error fetching restaurant reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, perPage, restaurantId, sortOrder, ratingFilter]); // Add ratingFilter as a dependency

  const refreshReviews = () => {
    fetchReviews();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchGET("/user");
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const userReview = reviews.find(
        (review) => review.authorId === user.userId,
      );
      setHasReviewed(!!userReview);
    }
  }, [user, reviews]);

  const handleAddReviewClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setReviewText("");
    setStarRating(0);
  };

  const handleSubmitReview = async () => {
    if (starRating === null || !reviewText) return;

    const reviewData = {
      stars: starRating,
      contents: reviewText,
    };

    try {
      await fetchPOST(
        `/restaurants/${restaurantId}/reviews`,
        JSON.stringify(reviewData),
      );
      handleDialogClose();
      refreshReviews();
      setCurrentPage(1); // Reset to the first page after submitting a review
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const isSubmitDisabled = !reviewText || starRating === null;

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg dark:text-grey-1">
      <div className="flex h-full w-full flex-col gap-2">
        {/* Reviews and Filters */}
        <h1 className="font-mont-bd text-2xl text-black dark:text-white">
          {t("reviews.reviews")}:
        </h1>
        {!isPreview && (
          <div className="flex w-full gap-2">
            <Tooltip title={t("reviews.sort")}>
              <button
                className="z-1 h-12 w-12 rounded-lg bg-grey-0 text-black hover:bg-white dark:bg-grey-5 dark:text-white dark:hover:bg-grey-6"
                onClick={toggleSortOrder}
              >
                <SwapVertIcon />
              </button>
            </Tooltip>
            <RestaurantReviewsFilters
              setValue={setRatingFilter}
              value={ratingFilter}
            />
            <button
              className={`z-1 h-12 w-[180px] rounded-lg bg-grey-0 text-primary dark:bg-grey-5 dark:text-secondary ${
                hasReviewed
                  ? "cursor-not-allowed"
                  : "hover:bg-white dark:hover:bg-grey-6"
              }`}
              onClick={handleAddReviewClick}
              disabled={hasReviewed}
            >
              {hasReviewed ? (
                <>
                  {t("reviews.review-submitted")} <CheckIcon />
                </>
              ) : (
                `+ ${t("reviews.add-review")}`
              )}
            </button>
          </div>
        )}

        {/* Display Reviews */}
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <RestaurantReview
              key={review.reviewId}
              review={review}
              refreshReviews={refreshReviews}
              user={user}
            />
          ))
        ) : (
          <div className="mt-4 text-center">
            <h1>{t("reviews.no-reviews")}</h1>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-end">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </div>

      {/* Add Review Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{t("reviews.add-review")}</DialogTitle>
        <DialogContent>
          <h2>{t("reviews.rating")}:</h2>
          <Rating
            name="star-rating"
            value={starRating}
            onChange={(event, newValue) => setStarRating(newValue)}
          />
          <textarea
            placeholder={t("reviews.review-text")}
            className="w-full rounded border p-4 dark:border-grey-4 dark:bg-grey-6 dark:text-white"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            className="rounded-lg text-primary dark:text-secondary"
          >
            {t("general.cancel")}
          </Button>
          <Button
            onClick={handleSubmitReview}
            className={`rounded-lg ${isSubmitDisabled ? "text-grey-3 dark:text-grey-5" : "text-primary dark:text-secondary"}`}
            disabled={isSubmitDisabled}
          >
            {t("general.submit")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FocusedRestaurantReviewsList;
