import React, { useEffect, useState } from "react";
import RestaurantReviewsFilters from "./restaurants/restaurantReviews/RestaurantReviewsFilters";
import RestaurantReview from "./restaurants/restaurantReviews/RestaurantReview";
import { ReviewType, User } from "../../services/types";
import { useTranslation } from "react-i18next";
import { fetchGET } from "../../services/APIconn";
import { Pagination, Tooltip } from "@mui/material";
import { SwapVert as SwapVertIcon } from "@mui/icons-material";

interface ReviewsManagementProps {
  activeRestaurantId: number;
 
}

const ReviewsManagement: React.FC<ReviewsManagementProps> = ({ activeRestaurantId }) => {
  const [filteredAndSortedReviews, setFilteredAndSortedReviews] = useState<ReviewType[] | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [ratingFilter, setRatingFilter] = useState<number>(0); // Track selected rating filter
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useTranslation("global");
  const [perPage] = useState<number>(5);
  const [user, setUser] = useState<User | null>(null);

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
    } catch (error) {
      console.error("Error fetching restaurant reviews:", error);
    }
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
    fetchReviews();
  }, [currentPage, perPage, activeRestaurantId, sortOrder, ratingFilter]); // Add ratingFilter as a dependency

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg dark:text-grey-1">
      <div className="flex flex-col gap-2 h-full w-full">
        {/* Filter and Sort Controls */}
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
        </div>

        {/* Display Filtered and Sorted Reviews */}
        {filteredAndSortedReviews === null || filteredAndSortedReviews.length === 0 ? (
          <div className="mt-4 text-center">
            <h1>{t("reviews.no-reviews")}</h1>
          </div>
        ) : (
          filteredAndSortedReviews.map((review) => (
            <RestaurantReview key={review.reviewId} review={review} refreshReviews={fetchReviews} user={user} isOwnerView={true} restaurantId={activeRestaurantId}/>
          ))
        )}
      </div>
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
    
  );
};

export default ReviewsManagement;
