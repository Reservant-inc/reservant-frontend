import React, { useEffect, useState } from "react";
import RestaurantReviewsFilters from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReviewsFilters";
import RestaurantReview from "../../../restaurantManagement/restaurants/restaurantReviews/RestaurantReview";
import { Button } from "@mui/material";
import { ReviewType } from "../../../../services/types";
import { useTranslation } from "react-i18next";
import { FetchError } from "../../../../services/Errors";
import { fetchGET } from "../../../../services/APIconn";

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

  const [t] = useTranslation("global")

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
              <Button
                className="w-1/2 dark:bg-grey-5 bg-grey-0 rounded-lg text-primary dark:text-secondary dark:hover:bg-grey-6 hover:bg-grey-1"
              >
                + {t("reviews.add-review")}
              </Button>
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
      </div>
      <dialog>

      </dialog>
    </div>
  );
};

export default FocusedRestaurantReviewsList;
