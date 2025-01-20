import { ListItemButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp'
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp'
import ReportIcon from '@mui/icons-material/Report'
import BarChartIcon from '@mui/icons-material/BarChart'
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
import { useTranslation } from 'react-i18next'

const ManagementTabs: React.FC = ({}) => {
  const navigate = useNavigate()
  const size = useWindowDimensions()
  const { restaurantId } = useParams()
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType>()
  const [t] = useTranslation('global')

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
              path="statistics"
              title={t('management-tabs.statistics')}
              icon={<BarChartIcon />}
              id="management_dashboard"
            />
            <Tab
              path="restaurants"
              title={t('management-tabs.restaurants')}
              icon={<LocalDiningSharpIcon />}
              id="management_restaurants"
            />
            <Tab
              path="employee-management"
              title={t('management-tabs.employeeManagement')}
              icon={<PeopleAltSharpIcon />}
              id="management_employees"
            />
          </div>
        ) : size.width > 1000 ? (
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
              title={t('management-tabs.dashboard')}
              icon={<Dashboard />}
              id="management_restaurant_dashboard"
            />
            <Tab
              path={`restaurant/${restaurantId}/restaurant-statistics`}
              title={t('management-tabs.statistics')}
              icon={<BarChartIcon />}
              id="management_restaurant_statistics"
            />
            <Tab
              path={`restaurant/${restaurantId}/restaurant-employee-management`}
              title={t('management-tabs.employments')}
              icon={<PeopleAltSharpIcon />}
              id="management_restaurant_employees"
            />
            <Tab
              path={`restaurant/${restaurantId}/menu-management`}
              title={t('management-tabs.menus')}
              id="management_restaurant_menus"
              icon={<Dining />}
            />
            <Tab
              path={`restaurant/${restaurantId}/warehouse-management`}
              title={t('management-tabs.warehouse')}
              icon={<Warehouse />}
              id="management_restaurant_warehouse"
            />
            <Tab
              path={`restaurant/${restaurantId}/reservation-history`}
              title={t('management-tabs.reservationHistory')}
              id="management_restaurant_history"
              icon={<History />}
            />
            <Tab
              path={`restaurant/${restaurantId}/reviews-management`}
              title={t('management-tabs.reviews')}
              id="management_restaurant_reviews"
              icon={<RateReviewIcon />}
            />
            <Tab
              path={`restaurant/${restaurantId}/deliveries-management`}
              title={t('management-tabs.deliveries')}
              id="management_restaurant_deliveries"
              icon={<LocalShipping />}
            />
            <Tab
              path={`restaurant/${restaurantId}/reports`}
              title={t('management-tabs.reports')}
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
                  className={`   h-full w-full rounded-t-lg px-4 dark:text-grey-1 ${isPressed ? 'dark:bg-grey-5 bg-grey-0' : ' bg-white dark:bg-black '}`}
                  onClick={pressHandler}
                >
                  <MoreVert className="h-6 w-6" />
                </ListItemButton>
              </div>
              <div className="absolute">
                {isPressed && (
                  <div className="w-full rounded-lg dark:bg-grey-5 bg-grey-0 relative z-[1] p-2 flex flex-col gap-2">
                    <Tab
                      path={`restaurant/${restaurantId}/restaurant-dashboard`}
                      title={t('management-tabs.dashboard')}
                      icon={<Dashboard />}
                      id="management_restaurant_dashboard"
                      full={true}
                      onClose={pressHandler}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/restaurant-employee-management`}
                      title={t('management-tabs.employments')}
                      icon={<PeopleAltSharpIcon />}
                      onClose={pressHandler}
                      full={true}
                      id="management_restaurant_employees"
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/menu-management`}
                      title={t('management-tabs.menus')}
                      id="management_restaurant_menus"
                      onClose={pressHandler}
                      full={true}
                      icon={<Dining />}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/warehouse-management`}
                      title={t('management-tabs.warehouse')}
                      onClose={pressHandler}
                      full={true}
                      icon={<Warehouse />}
                      id="management_restaurant_warehouse"
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/reservation-history`}
                      title={t('management-tabs.reservationHistory')}
                      id="management_restaurant_history"
                      onClose={pressHandler}
                      full={true}
                      icon={<History />}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/reviews-management`}
                      title={t('management-tabs.reviews')}
                      id="management_restaurant_reviews"
                      onClose={pressHandler}
                      full={true}
                      icon={<RateReviewIcon />}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/deliveries-management`}
                      title={t('management-tabs.deliveries')}
                      id="management_restaurant_deliveries"
                      onClose={pressHandler}
                      full={true}
                      icon={<LocalShipping />}
                    />
                    <Tab
                      path={`restaurant/${restaurantId}/reports`}
                      title={t('management-tabs.reports')}
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
      <Tooltip
        title={
          restaurantId ? `${t('management-tabs.restaurant')} ${restaurant?.name}` : t('management-tabs.managementPanel')
        }
        placement="bottom"
        arrow
      >
        <h1 className="text-xl dark:text-grey-0 truncate text-right text-nowrap">
          {restaurantId ? `${t('management-tabs.restaurant')} ${restaurant?.name}` : t('management-tabs.managementPanel')}
        </h1>
      </Tooltip>
    </div>
  )
}

export default ManagementTabs
