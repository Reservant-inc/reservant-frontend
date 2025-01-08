import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { fetchGET, getImage } from '../../../services/APIconn';
import DefaultImage from '../../../assets/images/defaulImage.jpeg';

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
    <div className="flex h-full w-full gap-4 bg-grey-1 dark:bg-grey-6">
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

        <div className="flex flex-col bg-white rounded-lg p-4 shadow-md h-[70%]">
          <h1 className="text-lg font-mont-bd">mapka moze?</h1>
        </div>
      </div>

      {/* prawa kol */}
<div className="flex flex-col bg-white rounded-lg p-8 shadow-md h-full w-1/2">
  <h1 className="text-lg font-mont-bd">Restaurant Details</h1>
  <div className="flex flex-col gap-4 mt-4">
    <p>
      <span className="font-mont-bd">Name:</span> {restaurant.name}
    </p>
    <p>
      <span className="font-mont-bd">Type:</span> {restaurant.restaurantType}
    </p>
    <p>
      <span className="font-mont-bd">Address:</span> {restaurant.address},{' '}
      {restaurant.postalIndex}, {restaurant.city}
    </p>
    <p>
      <span className="font-mont-bd">Location:</span> Lat {restaurant.location.latitude}, Lng{' '}
      {restaurant.location.longitude}
    </p>
    <p>
      <span className="font-mont-bd">Delivery:</span>{' '}
      {restaurant.provideDelivery ? 'Yes' : 'No'}
    </p>
    <p>
      <span className="font-mont-bd">Description:</span> {restaurant.description}
    </p>
    <p>
      <span className="font-mont-bd">Rating:</span> {restaurant.rating} / 5 (
      {restaurant.numberReviews} reviews)
    </p>
    <p>
      <span className="font-mont-bd">Tags:</span> {restaurant.tags.join(', ')}
    </p>
    <p>
      <span className="font-mont-bd">Max Reservation Duration:</span>{' '}
      {restaurant.maxReservationDurationMinutes} minutes
    </p>
    <p>
      <span className="font-mont-bd">Tables:</span> {restaurant.tables.length} (Total capacity: {restaurant.tables.reduce((acc: number, table: { capacity: number }) => acc + table.capacity, 0)}
)
    </p>
    <div>
      <span className="font-mont-bd">Opening Hours:</span>
      <ul className="text-sm text-grey-4 dark:text-grey-2 mt-2">
      {restaurant.openingHours.map((hours: { from: string; until: string }, index: number) => (

          <li key={index}>
            {hours.from} - {hours.until}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

    </div>
  );
};

export default RestaurantDetails;
