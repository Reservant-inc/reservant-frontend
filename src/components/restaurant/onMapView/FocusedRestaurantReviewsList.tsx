import React, { useEffect, useState } from "react";
import RestaurantReviewsFilters from "../../restaurantManagement/restaurants/restaurantReviews/RestaurantReviewsFilters";
import RestaurantReview from "../../restaurantManagement/restaurants/restaurantReviews/RestaurantReview";
import { ReviewType , User} from "../../../services/types";
import { useTranslation } from "react-i18next";
import { FetchError } from "../../../services/Errors";
import { fetchGET, fetchPOST } from "../../../services/APIconn";
import RestaurantEventsModal from "../events/RestaurantEventsModal";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, Rating, Tooltip } from "@mui/material";
import { Check as CheckIcon, SwapVert as SwapVertIcon } from "@mui/icons-material";


interface FocusedRestaurantReviewsListProps {
  isPreview: boolean;
  reviews: ReviewType[];
  activeRestaurantId: number
}

const FocusedRestaurantReviewsList: React.FC<
  FocusedRestaurantReviewsListProps
> = ({ isPreview, reviews, activeRestaurantId }) => {
  const [ filteredAndSortedReviews, setFilteredAndSortedReviews ] = useState<ReviewType[]>(reviews)
  const [ value, setValue ] = useState<number>(0)
  const [ isOwner, setIsOwner ] = useState<boolean>(false)
  const [showEventsModal, setShowEventsModal] = useState<boolean>(false); // temp bo idk gdzie to bedzie a zeby pokazac
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [ratingFilter, setRatingFilter] = useState<number>(0); // Track selected rating filter
  const [totalPages, setTotalPages] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [starRating, setStarRating] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState("");


  const [t] = useTranslation("global");

  // Function to fetch reviews with filtering and sorting applied
  const fetchReviews = async () => {
    try {
      // Fetch data from API with the selected sort order and page settings
      const data = await fetchGET(
        `/restaurants/${activeRestaurantId}/reviews?page=${currentPage - 1}&perPage=${perPage}&orderBy=${
          sortOrder === 'asc' ? 'DateAsc' : 'DateDesc'
        }`
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
  }, [currentPage, perPage, activeRestaurantId, sortOrder, ratingFilter]); // Add ratingFilter as a dependency

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
      await fetchPOST(`/restaurants/${activeRestaurantId}/reviews`, JSON.stringify(reviewData));
      handleDialogClose();
      refreshReviews();
      setCurrentPage(1); // Reset to the first page after submitting a review
      setHasReviewed(true)
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const isSubmitDisabled = !reviewText || starRating === null;

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg dark:text-grey-1">
      <div className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-col gap-2 h-full w-full">
          <h1 className="text-xl font-mont-bd text-black dark:text-white">{t("reviews.reviews")}:</h1>
          {!isPreview && (
          <div className="flex w-full gap-2">
            <RestaurantReviewsFilters setValue={setRatingFilter} value={ratingFilter} />
            <Tooltip title={t("reviews.sort")}>
              <button
                className="border-[1px] border-primary dark:border-secondary rounded-lg text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
                onClick={toggleSortOrder}
              >
                <SwapVertIcon />
              </button>
            </Tooltip>
            <button
              className={`w-1/2 border-[1px] border-primary dark:border-secondary rounded-lg text-primary dark:text-secondary ${
                hasReviewed ? "cursor-not-allowed" : "dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
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
            <RestaurantReview key={review.reviewId} review={review} refreshReviews={refreshReviews} user={user} onReviewDeleted={() => setHasReviewed(false)}/>
          ))
        ) : (
          <div className="mt-4 text-center">
            <h1>{t("reviews.no-reviews")}</h1>
          </div>
        )}

          {/* Pagination */}
          <div className="flex justify-end mt-4">
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
       

        {/* Modal wydarzeń */}
        {/* Tymczasowy przycisk do otwarcia RestaurantEventsModal */}
        <div className="flex justify-center mt-4">
        <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-2 dark:bg-secondary dark:hover:bg-secondary-2"
              onClick={() => setShowEventsModal(true)}
            >
            Temporary - Show Events
          </button>
        </div>
        {showEventsModal && (
          <RestaurantEventsModal
            open={showEventsModal}
            onClose={() => setShowEventsModal(false)}
            restaurantId={activeRestaurantId} 
          />
        )}
      </div>
 
  );
};

export default FocusedRestaurantReviewsList;
