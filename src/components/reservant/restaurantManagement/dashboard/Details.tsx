import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { fetchGET } from '../../../../services/APIconn'
import { RestaurantDetailsType } from '../../../../services/types'

const Details: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType | null>(
    null
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (restaurantId) fetchRestaurantDetails()
  }, [restaurantId])

  const fetchRestaurantDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetchGET(`/restaurants/${restaurantId}`)
      setRestaurant(response)
    } catch (error) {
      console.error('Error fetching restaurant details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-fit self-start flex-col w-full bg-white rounded-lg p-4 gap-4 shadow-md">
      <div className="flex justify-between w-full">
        <h1 className="text-lg font-mont-bd">Restaurant Details</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : restaurant ? (
        <div className="space-y-4">
          <p>
            <strong>ID:</strong> {restaurant.restaurantId}
          </p>
          <p>
            <strong>Name:</strong> {restaurant.name}
          </p>
          <p>
            <strong>Type:</strong> {restaurant.restaurantType}
          </p>
          <p>
            <strong>Address:</strong> {restaurant.address},{' '}
            {restaurant.postalIndex}, {restaurant.city}
          </p>
          <p>
            <strong>Location:</strong> Lat {restaurant.location.latitude}, Lng{' '}
            {restaurant.location.longitude}
          </p>
          <p>
            <strong>Delivery:</strong>{' '}
            {restaurant.provideDelivery ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Description:</strong> {restaurant.description}
          </p>
          <p>
            <strong>Rating:</strong> {restaurant.rating} / 5 (
            {restaurant.numberReviews} reviews)
          </p>
          <p>
            <strong>Tags:</strong> {restaurant.tags.join(', ')}
          </p>
        </div>
      ) : (
        <p className="text-center text-grey-5">No restaurant data available.</p>
      )}
    </div>
  )
}

export default Details
