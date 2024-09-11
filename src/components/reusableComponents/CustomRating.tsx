import { Rating } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import React from "react";

const CustomRating = ({ rating, readOnly, className } : { rating: number, readOnly: boolean, className?: string }) => {
    return (
        <Rating
            name="read-only"
            value={rating}
            readOnly={readOnly}
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