import React, { useState } from "react";
import RestaurantReviewsFilters from "./RestaurantReviewsFilters";
import RestaurantReview from "./RestaurantReview";

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
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 5,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 6,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 7,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
  {
    id: 4,
    score: 3,
    date: "2024-05-13",
    description:
      "Average experience. The food was fine, but nothing exceptional.",
    managerResponse: null,
  },
];

interface RestaurantReviewsListProps {
  isPreview: boolean
}

const RestaurantReviewsList: React.FC<RestaurantReviewsListProps> = ({ isPreview }) => {
  // downloaded from api when it's ready
  const [reviews, setReviews] = useState(dummyReviews);
  const [sort, setSort] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleSort = (reviews: any[]) => {
    // ^ zmienic
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

  const displayReviews = () => {
    const column1: any[] = []
    const column2: any[] = []

    for (let i = 0; i < filteredAndSortedReviews.length; i++) {
      i % 2 === 0 ? column1.push(filteredAndSortedReviews[i]) : column2.push(filteredAndSortedReviews[i])
    }


    return  <div className="flex gap-1">
              <div className="h-full w-1/2 flex flex-col gap-2">
                  {column1.map((review) => (
                    <RestaurantReview key={review.id} {...review} />
                  ))}
              </div>
              <div className="h-full w-1/2 flex flex-col gap-2">
                  {column2.map((review) => (
                    <RestaurantReview key={review.id} {...review} />
                  ))}
              </div>
            </div>
  }      

  return (
    <div className="h-full w-full flex flex-col dark:text-grey-1 gap-2 rounded-lg">
      {
        isPreview ? (
          <div className="overflow-y-auto scroll">
            {
              filteredAndSortedReviews.length > 0 ? (
                filteredAndSortedReviews.map((review) => (
                  <RestaurantReview key={review.id} {...review} />
                ))
              ) : (
                <div className="mt-4 text-center">No matching reviews</div>
              )
            }
          </div>  
        ) : (
          <div className="h-full w-full flex flex-col gap-2">
            <RestaurantReviewsFilters
              sort={sort}
              setSort={setSort}
              filterText={filterText}
              setFilterText={setFilterText}
            />
            <div className="h-full w-full overflow-y-auto scroll">
                {displayReviews()}
            </div>  
          </div>  
        )
      }
    </div>
  );
};

export default RestaurantReviewsList;
