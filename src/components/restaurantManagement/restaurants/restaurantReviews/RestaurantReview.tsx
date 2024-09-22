import React from "react";
import { Avatar, Button } from "@mui/material";
import CustomRating from "../../../reusableComponents/CustomRating";
import { ReviewType } from "../../../../services/types";
import { useTranslation } from "react-i18next";

interface RestaurantReviewProps {
  review: ReviewType
}

const RestaurantReview: React.FC<RestaurantReviewProps> = ({
  review
}) => {

  const { t } = useTranslation("global");
  const reducedDescription =
  review.contents.length > 100 ? review.contents.substring(0, 100) + "..." : review.contents;

  return (
    <div className="flex h-[10rem] flex-col justify-between gap-2 rounded-lg border-grey-0 p-2 dark:bg-grey-6 bg-grey-0">
      <div className="flex items-center items-center justify-between space-x-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8">A</Avatar>
          <p>{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <CustomRating rating={review.stars} readOnly={true} />
      </div>
      <div className="flex flex-col items-start">
        {reducedDescription.replace(/\s/g, "").length > 0 ? (
          <p>{reducedDescription}</p>
        ) : (
          <p className="italic">{t('reviews.no-description')}.</p>
        )}
        <div className="flex justify-end">
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button
          id="RestaurantReviewMoreButton"
          className="rounded-lg text-primary dark:text-secondary"
        >
          {t('reviews.respond')}
        </Button>
      </div>
    </div>
  );
};

export default RestaurantReview;
