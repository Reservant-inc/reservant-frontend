import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
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
        <Tooltip title={t("reviews.filter-tooltip")}>
          <button
            className="z-1 h-8 w-8 bg-trans hover:bg-grey-1 dark:hover:bg-grey-4 dark:text-grey-1 rounded-full"
          >
            <CloseIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default RestaurantReviewsFilters;
