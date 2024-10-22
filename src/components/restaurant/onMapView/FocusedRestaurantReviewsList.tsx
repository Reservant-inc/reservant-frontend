import React, { useEffect, useState } from "react";
import RestaurantReviewsFilters from "../../restaurantManagement/restaurants/restaurantReviews/RestaurantReviewsFilters";
import RestaurantReview from "../../restaurantManagement/restaurants/restaurantReviews/RestaurantReview";
import { ReviewType } from "../../../services/types";
import { useTranslation } from "react-i18next";
import { FetchError } from "../../../services/Errors";
import { fetchGET } from "../../../services/APIconn";
import RestaurantEventsModal from "../events/RestaurantEventsModal";

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

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        await fetchGET(`/my-restaurants/${activeRestaurantId}`)
        setIsOwner(true)
      } catch (error) {
        if (error instanceof FetchError){
          if (error.status = 404) {
            setIsOwner(false)
          }
        }
      }
    }
  
    checkOwnership()
  }, [activeRestaurantId])

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg dark:text-grey-1">
      <div className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-col gap-2 h-full w-full">
          <h1 className="text-xl font-mont-bd text-black dark:text-white">{t("reviews.reviews")}:</h1>
          {!isPreview && (
            <div className="flex w-full justify-between gap-2">
              <RestaurantReviewsFilters
                setValue={setValue}
                value={value}
              />
              <button
                className="w-1/2 border-[1px] border-primary dark:border-secondary rounded-lg text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
              >
                + {t("reviews.add-review")}
              </button>
            </div>
          )}
          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map((review) => (
              <RestaurantReview key={review.reviewId} review={review} isOwner={isOwner}/>
            ))
          ) : (
            <div className="mt-4 text-center">
              <h1>{t("reviews.no-reviews")}</h1>
            </div>
          )}
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
    </div>
  );
};

export default FocusedRestaurantReviewsList;
