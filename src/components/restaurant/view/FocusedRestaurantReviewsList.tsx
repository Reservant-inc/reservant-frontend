import React, { useState } from "react";
import RestaurantReviewsFilters from "../../restaurantManagement/restaurants/restaurantReviews/RestaurantReviewsFilters";
import RestaurantReview from "../../restaurantManagement/restaurants/restaurantReviews/RestaurantReview";

const dummyReviews = [
  {
    id: 1,
    score: 4,
    date: "2024-05-10",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus congue, turpis non condimentum hendrerit, massa magna volutpat dui, in tincidunt metus libero a ex. Phasellus molestie luctus nibh in lacinia. Donec eget ante nec purus tempus facilisis eu vel magna. Duis ut lectus quis lectus pretium porta a sed dui. Aenean placerat a tortor quis gravida. Sed aliquet id enim ac aliquet. Curabitur nec sapien nulla. Integer odio ante, finibus ultrices arcu id, posuere interdum dui. Donec non ornare lectus. Quisque eu ante posuere, lobortis urna a, tempus lectus. Duis eget metus dolor. Mauris condimentum mattis nunc vitae dapibus. Aenean mi nulla, sodales luctus nisl vitae, consectetur fringilla risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce non elit ipsum",
    managerResponse: {
      date: "2024-05-12",
      description: "",
    },
  },
  {
    id: 2,
    score: 2,
    date: "2024-05-11",
    description: "",
    managerResponse: {
      date: "2024-05-13",
      description: "",
    },
  },
  {
    id: 3,
    score: 5,
    date: "2024-05-12",
    description: "Excellent stay! The food was great.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 5,
    date: "2024-05-12",
    description: "Excellent stay! The food was great.",
    managerResponse: null,
  },
  {
    id: 5,
    score: 5,
    date: "2024-05-12",
    description: "Excellent stay! The food was great.",
    managerResponse: null,
  },
  {
    id: 6,
    score: 5,
    date: "2024-05-12",
    description: "Excellent stay! The food was great.",
    managerResponse: null,
  },
  {
    id: 7,
    score: 5,
    date: "2024-05-12",
    description: "Excellent stay! The food was great.",
    managerResponse: null,
  },
  {
    id: 8,
    score: 5,
    date: "2024-05-12",
    description: "Excellent stay! The food was great.",
    managerResponse: null,
  },
  {
    id: 9,
    score: 5,
    date: "2024-05-12",
    description: "Excellent stay! The food was great.",
    managerResponse: null,
  },
];

interface FocusedRestaurantReviewsListProps {
  isPreview: boolean;
}

const FocusedRestaurantReviewsList: React.FC<
  FocusedRestaurantReviewsListProps
> = ({ isPreview }) => {
  const [reviews, setReviews] = useState(dummyReviews);
  const [sort, setSort] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleSort = (reviews: any[]) => {
    switch (sort) {
      case "1": // od a do z
        return reviews.sort((a, b) =>
          a.description.localeCompare(b.description),
        );
      case "2": // od najnowszych
        return reviews.sort(
          (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
        );
      case "3": // ascending
        return reviews.sort((a, b) => a.score - b.score);
      case "4": // descending
        return reviews.sort((a, b) => b.score - a.score);
      default:
        return reviews;
    }
  };

  const filteredAndSortedReviews =
    filterText.length >= 3
      ? handleSort(
          reviews.filter((review) =>
            review.description.toLowerCase().includes(filterText.toLowerCase()),
          ),
        )
      : handleSort(reviews);

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg dark:text-grey-1">
      {isPreview ? (
        <div className="scroll overflow-y-auto">
          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map((review) => (
              <RestaurantReview key={review.id} {...review} />
            ))
          ) : (
            <div className="mt-4 text-center">No matching reviews</div>
          )}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col gap-2">
          <RestaurantReviewsFilters
            sort={sort}
            setSort={setSort}
            filterText={filterText}
            setFilterText={setFilterText}
          />
          <div className="scroll h-full w-full overflow-y-auto">
            {filteredAndSortedReviews.map((review) => (
              <RestaurantReview key={review.id} {...review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusedRestaurantReviewsList;
