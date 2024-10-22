import React, { useEffect, useState } from "react";
import RestaurantReviewsFilters from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReviewsFilters";
import RestaurantReview from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReview";
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
import { ReviewType, User } from "../../../../services/types";
import { useTranslation } from "react-i18next";
import { fetchGET, fetchPOST } from "../../../../services/APIconn";
import { Check as CheckIcon, SwapVert as SwapVertIcon } from "@mui/icons-material";

interface FocusedRestaurantReviewsListProps {
  isPreview: boolean;
  reviews: ReviewType[];
  isDelivering: boolean;
  restaurantId: number;
  refreshReviews: () => void;
}

const FocusedRestaurantReviewsList: React.FC<FocusedRestaurantReviewsListProps> = ({
  isPreview,
  reviews,
  isDelivering,
  restaurantId,
  refreshReviews,
}) => {
  const [filteredAndSortedReviews, setFilteredAndSortedReviews] = useState<ReviewType[]>([]);
  const [value, setValue] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [starRating, setStarRating] = useState<number | null>(0);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [perPage] = useState<number>(10); 
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // State to manage sorting order
  const [t] = useTranslation("global");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await fetchGET(`/restaurants/${restaurantId}/reviews?page=${currentPage - 1}&perPage=${perPage}`);
        setFilteredAndSortedReviews(data.items || []);
        setTotalReviews(data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching restaurant reviews:", error);
      }
    };

    fetchReviews();
  }, [currentPage, perPage, restaurantId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchGET('/user');
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const sortedReviews = [...reviews]
      .filter((review) => (value > 0 ? review.stars === value : true))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt); 
        const dateB = new Date(b.createdAt);
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });

    setFilteredAndSortedReviews(sortedReviews);
  }, [reviews, value, sortOrder]); // Add sortOrder as a dependency

  useEffect(() => {
    if (user) {
      const userReview = reviews.find((review) => review.authorId === user.userId);
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
      await fetchPOST(`/restaurants/${restaurantId}/reviews`, JSON.stringify(reviewData));
      handleDialogClose();
      refreshReviews();
      setCurrentPage(1); // Reset to the first page after submitting a review
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const isSubmitDisabled = !reviewText || starRating === null;

  // Function to toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg dark:text-grey-1">
      <div className="flex h-full w-full flex-col gap-2">
        <div className="w-full h-[50px] rounded-lg flex gap-2">
          <button className="dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary w-full transition hover:scale-105">
            {t("home-page.reservation")}
          </button>
          <button className="dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary w-full transition hover:scale-105">
            {t("home-page.create-event")}
          </button>
          {isDelivering && (
            <button className="dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary w-full transition hover:scale-105">
              {t("home-page.order")}
            </button>
          )}
        </div>

        <h1 className="text-2xl font-mont-bd text-black dark:text-white">Menu:</h1>
        <div className="w-full h-[150px] dark:bg-grey-5 rounded-lg"></div>

        <div className="flex flex-col gap-2 h-full w-full">
          <h1 className="text-2xl font-mont-bd text-black dark:text-white">{t("reviews.reviews")}:</h1>
          {!isPreview && (
            <div className="flex w-full gap-2">
              <Tooltip title={t("reviews.sort")}>
                <Button
                  className={` dark:bg-grey-5 bg-grey-0 rounded-lg text-black dark:text-white dark:hover:bg-grey-6 hover:bg-white`}
                  onClick={toggleSortOrder}
                >
                  <SwapVertIcon />
                </Button>
              </Tooltip>
              <RestaurantReviewsFilters setValue={setValue} value={value} />
              <Button
                className={`w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary dark:text-secondary ${
                  hasReviewed ? "cursor-not-allowed" : "dark:hover:bg-grey-6 hover:bg-white"
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
              </Button>
            </div>
          )}

          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map((review) => (
              <RestaurantReview key={review.reviewId} review={review} refreshReviews={refreshReviews} user={user} />
            ))
          ) : (
            <div className="mt-4 text-center">
              <h1>{t("reviews.no-reviews")}</h1>
            </div>
          )}

          <div className="flex justify-end mt-4"> 
            <Pagination
              count={Math.ceil(totalReviews / perPage) + (totalReviews % perPage === 0 ? 0 : 1)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
      </div>

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
            className="w-full p-4 border rounded dark:bg-grey-6 dark:text-white dark:border-grey-4"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} className="rounded-lg text-primary dark:text-secondary">
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
