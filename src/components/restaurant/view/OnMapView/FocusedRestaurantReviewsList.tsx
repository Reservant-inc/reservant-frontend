import React, { useEffect, useState } from "react";
import RestaurantReviewsFilters from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReviewsFilters";
import RestaurantReview from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReview";
import { Button } from "@mui/material";
import { ReviewType } from "../../../../services/types";
import { useTranslation } from "react-i18next";
import EventCreationModal from "../../events/EventCreationModal";

interface FocusedRestaurantReviewsListProps {
  isPreview: boolean;
  reviews: ReviewType[];
  isDelivering: boolean;
  restaurantId: number;
}

const FocusedRestaurantReviewsList: React.FC<FocusedRestaurantReviewsListProps> = ({
  isPreview,
  reviews,
  isDelivering,
  restaurantId
}) => {
  const [filteredAndSortedReviews, setFilteredAndSortedReviews] = useState<ReviewType[]>(reviews);
  const [value, setValue] = useState<number>(0);
  // TEMP FOR EVENT MODAL
  const [modalOpen, setModalOpen] = useState(false); // Modal state

  const [t] = useTranslation("global");

  useEffect(() => {
    setValue(0);
  }, [reviews]);

  useEffect(() => {
    if (value > 0) {
      setFilteredAndSortedReviews(reviews.filter((review) => review.stars === value));
    } else {
      setFilteredAndSortedReviews(reviews);
    }
  }, [reviews, value]);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg dark:text-grey-1">
      <div className="flex h-full w-full flex-col gap-2">
        <div className="w-full h-[50px] rounded-lg flex gap-2">
          <button className="dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary w-full transition hover:scale-105">
            {t("home-page.reservation")}
          </button>
          <button
            onClick={handleModalOpen} // Otworzenie modala na tworzenie eventu
            className="dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary w-full transition hover:scale-105"
          >
            {t("home-page.create-event")}
          </button>
          {isDelivering && (
            <button className="dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary w-full transition hover:scale-105">
              {t("home-page.order")}
            </button>
          )}
        </div>
        <h1 className="text-2xl font-mont-bd text-black dark:text-white">Menu:</h1>
        <div className="w-full h-[150px] dark:bg-grey-5 rounded-lg"></div>
        <div className="flex flex-col gap-2 h-full w-full">
          <h1 className="text-2xl font-mont-bd text-black dark:text-white">
            {t("reviews.reviews")}:
          </h1>
          {!isPreview && (
            <div className="flex w-full gap-2">
              <RestaurantReviewsFilters setValue={setValue} value={value} />
              <Button className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary dark:text-secondary dark:hover:bg-grey-6 hover:bg-white">
                + {t("reviews.add-review")}
              </Button>
            </div>
          )}
          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map((review) => (
              <RestaurantReview key={review.reviewId} review={review} />
            ))
          ) : (
            <div className="mt-4 text-center">
              <h1>{t("reviews.no-reviews")}</h1>
            </div>
          )}
        </div>
      </div>

      {/* Event Creation Modal */}
      <EventCreationModal open={modalOpen} handleClose={handleModalClose} restaurantId={restaurantId}/>
    </div>
  );
};

export default FocusedRestaurantReviewsList;
