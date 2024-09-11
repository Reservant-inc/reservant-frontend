import {
  Button,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp";
import React, { useState } from "react";
import CustomRating from "../../../reusableComponents/CustomRating";
import { t } from "i18next";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";

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
  const [isReviewFilterPressed, setIsReviewFilterPressed] =
    useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<number>(0);

  const reviewsPressHandler = () => {
    setIsReviewFilterPressed(!isReviewFilterPressed);
  };

  return (
    <div>
      <div className="relative flex items-center justify-start gap-4 p-2">
        <OutsideClickHandler
          onOutsideClick={reviewsPressHandler}
          isPressed={isReviewFilterPressed}
        >
          <Button
            id="homePage-reviewsFilter"
            className={
              "flex h-10 gap-2 rounded-lg p-3 shadow-md " +
              (reviewFilter !== 0
                ? "bg-primary text-white dark:bg-secondary dark:text-black"
                : "bg-white text-black dark:bg-black dark:text-white")
            }
            onClick={reviewsPressHandler}
          >
            <StarPurple500SharpIcon
              className={
                "h-6 " +
                (reviewFilter !== 0
                  ? "text-white dark:text-black"
                  : "text-black dark:text-white")
              }
            />
            {reviewFilter === 0
              ? t("home-page.reviews")
              : `${reviewFilter}.0 or more`}
          </Button>
          {isReviewFilterPressed && (
            <div className="absolute top-[3rem] rounded-lg bg-white shadow-2xl dark:bg-black">
              <List
                id="homePage-restaurantList"
                className="w-full font-mont-md"
              >
                <ListItemButton
                  id="homePage-listItemButton"
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    setReviewFilter(0);
                    setIsReviewFilterPressed(false);
                  }}
                >
                  <Typography component="legend" className="dark:text-white">
                    {t("home-page.rating")}
                  </Typography>
                </ListItemButton>
                {[2, 3, 4, 5].map((value, index) => (
                  <ListItemButton
                    id="homePage-listItemButton"
                    className="flex items-center justify-center gap-2"
                    onClick={() => {
                      setReviewFilter(value);
                      setIsReviewFilterPressed(false);
                    }}
                    key={index}
                  >
                    <Typography component="legend" className="dark:text-white">
                      {value}.0
                    </Typography>
                    <CustomRating rating={value} readOnly={true}/>
                  </ListItemButton>
                ))}
              </List>
            </div>
          )}
        </OutsideClickHandler> 
        <Button
          id="RestaurantReviewssFiltersClearButton"
          variant="contained"
          style={{ backgroundColor: "#a94c79", color: "#fefefe" }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default RestaurantReviewsFilters;
