import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import CustomRating from "../../../reusableComponents/CustomRating";
import { ReviewType, UserInfo } from "../../../../services/types";
import { fetchGET, getImage } from "../../../../services/APIconn";
import { FetchError } from "../../../../services/Errors";
import DefaultImage from '../../../../assets/images/user.jpg'

interface RestaurantReviewProps {
  review: ReviewType
  isOwner: boolean
}

const RestaurantReview: React.FC<RestaurantReviewProps> = ({
  review,
  isOwner
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    const getAuthorInfo = async () => {
    try {
      const response = await fetchGET(`/users/${review.authorId}`)
      setUserInfo(response)
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log(error)
      }
    }
    }

    getAuthorInfo()
  }, [])

  const reducedDescription =
  review.contents.length > 100 ? review.contents.substring(0, 100) + "..." : review.contents;

  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border-grey-0 p-3 dark:bg-grey-6 bg-grey-0">
      <div className="flex items-center items-center justify-between space-x-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-3 items-center">
            <img src={getImage(userInfo?.photo as string, DefaultImage)} className="h-8 w-8 rounded-full"/>
            <p className="text-sm text-grey-5 dark:text-white">{review.authorFullName}</p>
          </div>
          <p className="text-sm text-grey-5 dark:text-white">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <CustomRating rating={review.stars} readOnly={true} />
      </div>
      <div className="flex flex-col items-start">
        {reducedDescription.replace(/\s/g, "").length > 0 ? (
          <p>{reducedDescription}</p>
        ) : (
          <p className="italic">No description.</p>
        )}
        <div className="flex justify-end">
        </div>
      </div>
      {
        isOwner && (
        <div className="flex w-full justify-end">
          <Button
            id="RestaurantReviewMoreButton"
            className="rounded-lg text-primary dark:text-secondary"
          >
            Respond
          </Button>
        </div>
        )
      }
    </div>
  );
};

export default RestaurantReview;
