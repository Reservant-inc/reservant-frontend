import React from 'react'
import { IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ComplaintDetailsProps {
  restaurant: any
  onClose: () => void
}

const PendingRestaurantDetails: React.FC<ComplaintDetailsProps> = ({
  restaurant,
  onClose
}) => {
  if (!restaurant) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>No details found for this complaint.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-black rounded-lg relative">
      <IconButton className="absolute top-2 right-2" onClick={onClose}>
        <CloseIcon className="dark:text-white" />
      </IconButton>
      <h2 className="text-lg font-semibold mb-4">Complaint Details</h2>
      <div className="space-y-4">
        <p>
          <strong>ID:</strong> {restaurant.restaurantId}
        </p>
        <p>
          <strong>Date:</strong>{' '}
          {new Date(restaurant.restaurantDate).toLocaleString()}
        </p>
        <p>
          <strong>Category:</strong> {restaurant.category}
        </p>
        <p>
          <strong>Description:</strong>{' '}
          {restaurant.description || 'No description provided'}
        </p>
        <p>
          <strong>Submitted By:</strong>{' '}
          {restaurant.createdBy
            ? `${restaurant.createdBy.firstName} ${restaurant.createdBy.lastName}`
            : 'Unknown'}
        </p>
        <p>
          <strong>restauranted User:</strong>{' '}
          {restaurant.restaurantedUser
            ? `${restaurant.restaurantedUser.firstName} ${restaurant.restaurantedUser.lastName}`
            : 'Unknown'}
        </p>
      </div>
      <div className="mt-4 space-y-2">
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See restauranter profile
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See restauranted user profile
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          Forward complaint
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          Respond to complaint
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          View restaurant
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          Grant promo code
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          View related order
        </button>
      </div>
    </div>
  )
}

export default PendingRestaurantDetails
