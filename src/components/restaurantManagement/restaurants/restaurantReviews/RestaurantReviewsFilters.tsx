import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CustomRating from "../../../reusableComponents/CustomRating";
import { Button } from "@mui/material";

interface RestaurantReviewsFiltersProps {
  sort: string;
  setSort: (value: string) => void;
  filterText: string;
  setFilterText: (text: string) => void;
}

const RestaurantReviewsFilters: React.FC<RestaurantReviewsFiltersProps> = ({
  sort,
  setSort,
  filterText,
  setFilterText,
}) => {
  const [value, setValue] = useState<number>(0)

  return (
    <div>
      <div className="flex gap-2 items-center bg-grey-0 dark:bg-grey-5 rounded-lg p-2">
        <h1>Filter:</h1>
        <CustomRating readOnly={false} rating={value} onChange={setValue}/>
        <button
          className="z-1 h-8 w-8 bg-trans hover:bg-grey-1 dark:hover:bg-grey-4 dark:text-grey-1 rounded-full"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default RestaurantReviewsFilters;
