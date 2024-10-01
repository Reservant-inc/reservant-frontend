import React from "react";
import CustomRating from "../../../reusableComponents/CustomRating";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

interface RestaurantReviewsFiltersProps {
  setValue: Function
  value: number
}

const RestaurantReviewsFilters: React.FC<RestaurantReviewsFiltersProps> = ({
  setValue,
  value
}) => {

  const [t] = useTranslation("global")

  return (
    <div>
      <div className="flex gap-2 items-center bg-grey-0 dark:bg-grey-5 rounded-lg p-2">
        <h1>{t("reviews.filter")}:</h1>
        <CustomRating readOnly={false} rating={value} onChange={setValue}/>
      </div>
    </div>
  );
};

export default RestaurantReviewsFilters;
