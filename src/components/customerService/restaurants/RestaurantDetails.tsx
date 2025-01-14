import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { fetchGET, getImage } from '../../../services/APIconn';
import DefaultImage from '../../../assets/images/defaulImage.jpeg';
import Details from '../../reservant/restaurantManagement/dashboard/Details';

const RestaurantDetails: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (restaurantId) {
      const fetchRestaurantDetails = async () => {
        try {
          setIsLoading(true);
          const response = await fetchGET(`/restaurants/${restaurantId}`);
          setRestaurant(response);
        } catch (error) {
          console.error('Error fetching restaurant details:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRestaurantDetails();
    }
  }, [restaurantId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center">
        <p className="text-grey-5">No restaurant details available.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-4 bg-grey-1 dark:bg-grey-5">
      {/* lewa kol */}
      <div className="flex flex-col gap-4 h-full w-1/2">
        {/* Logo */}
        <div className="flex h-[40%] bg-white rounded-lg overflow-hidden shadow-md">
          <img
            src={getImage(restaurant.logo, DefaultImage)}
            alt={`${restaurant.name} Logo`}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col bg-white dark:bg-black rounded-lg p-4 shadow-md h-[70%]">
          <h1 className="text-lg font-mont-bd">mapka moze?</h1>
        </div>
      </div>

      {/* prawa kol */}
      <Details/>
    </div>
  );
};

export default RestaurantDetails;

