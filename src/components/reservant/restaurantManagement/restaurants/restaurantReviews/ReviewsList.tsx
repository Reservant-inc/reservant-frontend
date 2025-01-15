import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchGET } from '../../../../../services/APIconn';
import Search from '../../../../reusableComponents/Search';
import RestaurantReview from './RestaurantReview';
import { ReviewType, User } from '../../../../../services/types';

const ReviewsList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewType[]>([]);
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const { t } = useTranslation('global');

  useEffect(() => {
    fetchReviews();
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setUserLoading(true);
      const userData = await fetchGET(`/users/${userId}`);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetchGET(`/users/${userId}/reviews`);
      setReviews(response.items);
      setFilteredReviews(response.items);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshReviews = () => {
    fetchReviews();
  };

  const handleSearchChange = (query: string) => {
    setFilteredReviews(
      query.length >= 3
        ? reviews.filter(review =>
            review.contents.toLowerCase().includes(query.toLowerCase())
          )
        : reviews
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-5 h-full">
        <div className="w-1/3">
          <Search
            filter={handleSearchChange}
            placeholder={t('profile.reviews.search')}
          />
        </div>

        <div className="flex flex-col h-full pr-2 overflow-y-auto scroll gap-5">

          {!loading && user ? (
            filteredReviews.length === 0 ? (
              <p className="italic text-center">
                {t('profile.reviews.no-reviews')}
              </p>
            ) : (
              filteredReviews.map(review => (
                <RestaurantReview 
                    review={review} 
                    key={review.reviewId} 
                    refreshReviews={refreshReviews}
                    user={user}
                    restaurantId={review.restaurantId}
                    isCustomerServiceView={true}
                    />
              ))
            )
          ) : (
            <CircularProgress className="text-grey-2" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
