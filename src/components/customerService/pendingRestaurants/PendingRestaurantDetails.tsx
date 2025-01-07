import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchPOST, getImage } from '../../../services/APIconn';
import DefaultImage from '../../../assets/images/defaulImage.jpeg';

interface PendingRestaurantDetailsProps {
  restaurant: any;
  onClose: () => void;
  fetchrestaurants: () => void;
}

const PendingRestaurantDetails: React.FC<PendingRestaurantDetailsProps> = ({
  restaurant,
  onClose,
  fetchrestaurants,
}) => {
  const [logoOpen, setLogoOpen] = useState<boolean>(false);

  const handleAccept = async () => {
    await fetchPOST(`/restaurants/${restaurant.restaurantId}/verify`);
    fetchrestaurants();
    alert('Restaurant accepted');
  };

  if (!restaurant) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>No details found for this restaurant.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-black rounded-lg flex flex-col gap-3 relative overflow-y-auto scroll">
      <IconButton className="absolute top-2 right-2" onClick={onClose}>
        <CloseIcon className="dark:text-white" />
      </IconButton>

      <div className="flex flex-col">
        <h1 className="text-lg font-mont-bd">Restaurant Details</h1>
        <h1 className="text-sm text-grey-4 dark:text-grey-2">
          ID: {restaurant.restaurantId}
        </h1>
      </div>

      <div className="flex flex-col gap-2 px-4">
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Group ID:</p>
          <p>{restaurant.groupId || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Name:</p>
          <p>{restaurant.name || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Type:</p>
          <p>{restaurant.restaurantType || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">City:</p>
          <p>{restaurant.city || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Postal Index:</p>
          <p>{restaurant.postalIndex || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Address:</p>
          <p>{restaurant.address || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Latitude:</p>
          <p>{restaurant.location?.latitude || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Longitude:</p>
          <p>{restaurant.location?.longitude || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Provides Delivery:</p>
          <p>{restaurant.provideDelivery ? 'Yes' : 'No'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Description:</p>
          <p>{restaurant.description || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Reservation Deposit Amount:</p>
          <p>{restaurant.reservationDeposit || 'N/A'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">NIP:</p>
          <p>{restaurant.nip || 'N/A'}</p>
        </h1>
      </div>

      <div className="flex flex-col gap-4 px-4">
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See owner's profile
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See rental contract
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See alcohol license
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See business permission
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See ID card
        </button>
        <button
          onClick={() => setLogoOpen(true)}
          className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
        >
          See Logo
        </button>
        <button
          onClick={handleAccept}
          className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
        >
          Accept Restaurant
        </button>
      </div>

      {logoOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[500px] p-4 bg-white rounded-lg">
            <img
              src={getImage(restaurant.logo, DefaultImage)}
              alt="Restaurant Logo"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setLogoOpen(false)}
              className="mt-4 w-full bg-red-500 text-white p-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRestaurantDetails;
