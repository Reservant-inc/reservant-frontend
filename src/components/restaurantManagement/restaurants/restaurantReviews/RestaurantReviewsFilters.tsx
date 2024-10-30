import React from "react";
import CustomRating from "../../../reusableComponents/CustomRating";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface RestaurantReviewsFiltersProps {
  setValue: Function;
  value: number;
}

const RestaurantReviewsFilters: React.FC<RestaurantReviewsFiltersProps> = ({
  setValue,
  value,
}) => {
  const [t] = useTranslation("global");

  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg bg-grey-0 p-2 dark:bg-grey-5">
        <h1>{t("reviews.filter")}:</h1>
        <CustomRating readOnly={false} rating={value} onChange={setValue} />
        <Tooltip title={t("reviews.filter-tooltip")}>
          <button
            className="h-8 w-8 rounded-full bg-trans hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-4"
            onClick={() => setValue(0)}
          >
            <CloseIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default RestaurantReviewsFilters;
