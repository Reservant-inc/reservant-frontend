import { ListItemButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp'
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp'
import ReportIcon from '@mui/icons-material/Report'
import {
  ArrowBack,
  Dashboard,
  Dining,
  History,
  Warehouse,
  LocalShipping,
  MoreVert
} from '@mui/icons-material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import Tab from './Tab'

import { useNavigate, useParams } from 'react-router-dom'
import { RestaurantDetailsType } from '../../../../services/types'
import { fetchGET } from '../../../../services/APIconn'
import useWindowDimensions from '../../../../hooks/useWindowResize'
import OutsideClickHandler from '../../../reusableComponents/OutsideClickHandler'

const ManagementTabs: React.FC = ({}) => {
  const navigate = useNavigate()
  const size = useWindowDimensions()
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
  const [isPressed, setIsPressed] = useState(false)
  const pressHandler = () => {
    setIsPressed(!isPressed)
  }

  return (
    <div className="flex gap-2 justify-between">
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
        ) : size.width > 1500 ? (
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
              title="Dashboard"
              icon={<Dashboard />}
              id="management_restaurant_dashboard"
            />
            <Tab
              path={`restaurant/${restaurantId}/restaurant-employee-management`}
              title="Employments"
              icon={<PeopleAltSharpIcon />}
              id="management_restaurant_employees"
            />
            <Tab
              path={`restaurant/${restaurantId}/menu-management`}
              title="Menus"
              id="management_restaurant_menus"
              icon={<Dining />}
            />
            <Tab
              path={`restaurant/${restaurantId}/warehouse-management`}
              title="Warehouse"
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
            <Tab
              path={`restaurant/${restaurantId}/deliveries-management`}
              title="Deliveries"
              id="management_restaurant_deliveries"
              icon={<LocalShipping />}
            />
            <Tab
              path={`restaurant/${restaurantId}/reports`}
              title="Reports"
              id="management_reports"
              icon={<ReportIcon />}
            />
          </div>
        ) : (
          <div className="flex gap-2 ">
            <div className="flex items-center justify-center pl-2">
              <ListItemButton
                id="menu-listItem-back-button"
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-grey-0 hover:bg-white dark:bg-grey-5 dark:text-grey-1 dark:hover:bg-black `}
                onClick={() => navigate('restaurants')}
              >
                <ArrowBack className="h-6 w-6" />
              </ListItemButton>
            </div>
            <OutsideClickHandler
              onOutsideClick={pressHandler}
              isPressed={isPressed}
            >
              <div className="flex items-center justify-center pl-2">
                <ListItemButton
                  id="menu-listItem-back-button"
                  className={` bg-white dark:bg-black  h-full w-full rounded-t-lg px-4 dark:text-grey-1`}
                  onClick={pressHandler}
                >
                  <MoreVert className="h-6 w-6" />
                </ListItemButton>
              </div>
              <div className="absolute">
                {isPressed && (
                  <div className="w-full rounded-b-lg bg-grey-5 relative z-[1] p-2 flex flex-col gap-2">
                    <Tab
                      path={`restaurant/${restaurantId}/restaurant-dashboard`}
                      title="Dashboard"
                      icon={<Dashboard />}
                      id="management_restaurant_dashboard"
                      full={true}
                      onClose={pressHandler}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/restaurant-employee-management`}
                      title="Employments"
                      icon={<PeopleAltSharpIcon />}
                      onClose={pressHandler}
                      full={true}
                      id="management_restaurant_employees"
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/menu-management`}
                      title="Menus"
                      id="management_restaurant_menus"
                      onClose={pressHandler}
                      full={true}
                      icon={<Dining />}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/warehouse-management`}
                      title="Warehouse"
                      onClose={pressHandler}
                      full={true}
                      icon={<Warehouse />}
                      id="management_restaurant_warehouse"
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/reservation-history`}
                      title="Reservation history"
                      id="management_restaurant_history"
                      onClose={pressHandler}
                      full={true}
                      icon={<History />}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/reviews-management`}
                      title="Reviews"
                      id="management_restaurant_reviews"
                      onClose={pressHandler}
                      full={true}
                      icon={<RateReviewIcon />}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/deliveries-management`}
                      title="Deliveries"
                      id="management_restaurant_deliveries"
                      onClose={pressHandler}
                      full={true}
                      icon={<LocalShipping />}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/reports`}
                      title="Reports"
                      id="management_reports"
                      onClose={pressHandler}
                      full={true}
                      icon={<ReportIcon />}
                    />
                  </div>
                )}
              </div>
            </OutsideClickHandler>
          </div>
        )}
      </div>
      <h1 className="text-xl dark:text-grey-0 text-right text-nowrap">
        {restaurantId ? `${restaurant?.name} restaurant` : 'Management panel'}
      </h1>
    </div>
  )
}

export default ManagementTabs
