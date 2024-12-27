import React from 'react'
import DefaultPhoto from '../../../assets/images/user.jpg'
import { RestaurantType } from '../../../services/types'
import { getImage } from '../../../services/APIconn'
import { useNavigate } from 'react-router-dom'

interface SearchedRestaurantProps {
  restaurant: RestaurantType
}

const SearchedRestaurant: React.FC<SearchedRestaurantProps> = ({ restaurant }) => {
  const navigate = useNavigate()

  return (
    <button
      className="flex w-[60%] items-center gap-[5px] overflow-x-hidden text-sm p-2"
      onClick={() => navigate(`restaurants/${restaurant.restaurantId}`)}
    >
      <img
        src={getImage(restaurant.logo, DefaultPhoto)}
        alt="restaurant photo"
        className="h-8 w-8 rounded-full"
      />
      <h1 className="dark:text-white">{restaurant.name}</h1>
    </button>
  )
}

export default SearchedRestaurant
