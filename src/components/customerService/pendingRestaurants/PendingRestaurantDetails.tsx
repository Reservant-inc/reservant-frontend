import React from 'react'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { fetchPOST } from '../../../services/APIconn'

interface ComplaintDetailsProps {
  restaurant: any
  onClose: () => void
  fetchrestaurants: () => void
}

const PendingRestaurantDetails: React.FC<ComplaintDetailsProps> = ({
  restaurant,
  onClose,
  fetchrestaurants
}) => {
  if (!restaurant) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>No details found for this complaint.</p>
      </div>
    )
  }

  const handleAccept = async () => {
    fetchPOST(`/restaurants/${restaurant.restaurantId}/verify`)
    fetchrestaurants()
    alert('restaurant accepted')
  }

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 bg-white dark:bg-black rounded-lg relative ">
      <IconButton className="absolute top-2 right-2" onClick={onClose}>
        <CloseIcon className="dark:text-white" />
      </IconButton>
      <h2 className="text-lg font-semibold ">Restaurant Details</h2>
      <div className="flex flex-col gap-2">
        <p>
          <strong>ID:</strong> {restaurant.restaurantId}
        </p>
        <p>
          <strong>Group ID:</strong> {restaurant.groupId}
        </p>
        <p>
          <strong>Name:</strong> {restaurant.name}
        </p>
        <p>
          <strong>Type:</strong> {restaurant.restaurantType}
        </p>
        <p>
          <strong>City:</strong> {restaurant.city}
        </p>
        <p>
          <strong>Postal Index:</strong> {restaurant.postalIndex}
        </p>
        <p>
          <strong>Address:</strong> {restaurant.address}
        </p>
        <p>
          <strong>Latitude:</strong> {restaurant.location.latitude}
        </p>
        <p>
          <strong>Longitude:</strong> {restaurant.location.longitude}
        </p>
        <p>
          <strong>Provides delivery:</strong>{' '}
          {restaurant.provideDelivery ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Description:</strong> {restaurant.description}
        </p>
        <p>
          <strong>Reservation deposit amount:</strong>{' '}
          {restaurant.reservationDeposit}
        </p>
        <p>
          <strong>NIP:</strong> {restaurant.nip}
        </p>
      </div>
      <div className=" flex flex-col gap-3">
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See restauranter profile
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See rental contract
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See alcohol license
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See business permission
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See ID card
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See Logo
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          Forward issue
        </button>
        <button
          onClick={handleAccept}
          className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
        >
          Accept restaurant
        </button>
        {/* <button
          onClick={() => console.log(restaurant)}
          className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
        >
          debug
        </button> */}
      </div>
    </div>
  )
}

export default PendingRestaurantDetails
