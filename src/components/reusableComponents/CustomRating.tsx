import { Rating } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import React from "react";

const CustomRating = ({ rating, readOnly, className, onChange } : { rating: number, readOnly: boolean, className?: string, onChange?: Function }) => {
    return (
        <Rating
            name="read-only"
            value={rating}
            readOnly={readOnly}
            onChange={(event, newValue) => {
                if (onChange)
                onChange(newValue);
              }}
            emptyIcon={
            <StarBorderIcon
                fontSize="inherit"
                className="text-grey-2 dark:text-grey-1"
            />
            }
            className={className}
        />
    )
}

export default CustomRating