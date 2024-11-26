import { ListItemButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp'
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp'
import useWindowDimensions from '../../../../hooks/useWindowResize'
import {
  ArrowBack,
  Dashboard,
  Dining,
  History,
  Warehouse
} from '@mui/icons-material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import Tab from './Tab'
import { useNavigate, useParams } from 'react-router-dom'
import { RestaurantDetailsType } from '../../../../services/types'
import { fetchGET } from '../../../../services/APIconn'

const ManagementTabs: React.FC = ({}) => {
  const navigate = useNavigate()

  const { restaurantId } = useParams()
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>()

  useEffect(() => {
    if (restaurantId) getRestaurantInfo()
  }, [restaurantId])

  const getRestaurantInfo = async () => {
    try {
      const response = await fetchGET(`/my-restaurants/${restaurantId}`)

      setRestaurant(response)
    } catch (error) {
      console.error('Error populating table', error)
    }
  }

  return (
    <div className="flex justify-between">
      <div id="menu-wrapper" className="text-sm">
        {restaurantId === undefined ? (
          <div className="flex gap-2">
            <Tab
              path="dashboard"
              title="Dashboard"
              icon={<Dashboard />}
              id="management_dashboard"
            />
            <Tab
              path="restaurants"
              title="Restaurants"
              icon={<LocalDiningSharpIcon />}
              id="management_restaurants"
            />
            <Tab
              path="employee-management"
              title="Employee management"
              icon={<PeopleAltSharpIcon />}
              id="management_employees"
            />
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex items-center justify-center pl-2">
              <ListItemButton
                id="menu-listItem-back-button"
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-grey-0 hover:bg-white dark:bg-grey-5 dark:text-grey-1 dark:hover:bg-black `}
                onClick={() => navigate('restaurants')}
              >
                <ArrowBack className="h-6 w-6" />
              </ListItemButton>
            </div>
            <Tab
              path={`restaurant/${restaurantId}/restaurant-dashboard`}
              title="Restaurant dashboard"
              icon={<Dashboard />}
              id="management_restaurant_dashboard"
            />
            <Tab
              path={`restaurant/${restaurantId}/restaurant-employee-management`}
              title="Employments management"
              icon={<PeopleAltSharpIcon />}
              id="management_restaurant_employees"
            />
            <Tab
              path={`restaurant/${restaurantId}/menu-management`}
              title="Menu management"
              id="management_restaurant_menus"
              icon={<Dining />}
            />
            <Tab
              path={`restaurant/${restaurantId}/warehouse-management`}
              title="Warehouse management"
              icon={<Warehouse />}
              id="management_restaurant_warehouse"
            />
            <Tab
              path={`restaurant/${restaurantId}/reservation-history`}
              title="Reservation history"
              id="management_restaurant_history"
              icon={<History />}
            />
            <Tab
              path={`restaurant/${restaurantId}/reviews-management`}
              title="Reviews"
              id="management_restaurant_reviews"
              icon={<RateReviewIcon />}
            />
          </div>
        )}
      </div>
      <h1 className="text-xl dark:text-grey-0">
        {restaurantId ? `${restaurant?.name} restaurant` : 'Management panel'}
      </h1>
    </div>
  )
}

export default ManagementTabs
