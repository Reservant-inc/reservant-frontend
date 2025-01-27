import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { fetchGET, getImage } from '../../../services/APIconn'
import DefaultImage from '../../../assets/images/user.jpg'
import Details from '../../reservant/restaurantManagement/dashboard/Details'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'

const RestaurantDetails: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [t] = useTranslation('global')

  useEffect(() => {
    if (restaurantId) {
      const fetchRestaurantDetails = async () => {
        try {
          setIsLoading(true)
          const response = await fetchGET(
            `/restaurants/${restaurantId}/full-details`
          )
          setRestaurant(response)
        } catch (error) {
          console.error('Error fetching restaurant details:', error)
        } finally {
          setIsLoading(false)
        }
      }

      const fetchEmployees = async () => {
        try {
          const response = await fetchGET(
            `/restaurants/${restaurantId}/employees`
          )
          setEmployees(response)
        } catch (error) {
          console.error('Error fetching employees:', error)
        }
      }

      fetchRestaurantDetails()
      fetchEmployees()
    }
  }, [restaurantId])

  const renderEmployeeDetails = (employee: any) => (
    <div key={employee.employeeId} className="p-4 bg-white my-2 dark:text-white dark:bg-black">
      <div className="flex justify-between items-center">
        <h1 className="font-mont-bd text-md">{`${employee.firstName} ${employee.lastName}`}</h1>
        <Link to={`/customer-service/users/${employee.employeeId}`}>
          <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
            {t('customer-service.restaurant-details.go-to-profile')}
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-4 pt-2">
        <img
          src={DefaultImage}
          alt={`${employee.firstName} ${employee.lastName}`}
          className="w-10 h-10 rounded-full self-start"
        />
        <div>
          <p className="font-mont-bd text-sm text-grey-3">
            {`${t('customer-service.restaurant-details.employee-id')}: ${employee.employeeId}`}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm">{t('customer-service.restaurant-details.hall')}:</p>
            {employee.isHallEmployee ? (
              <CheckIcon className="text-green" />
            ) : (
              <CloseIcon className="text-red" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm">{t('customer-service.restaurant-details.backdoor')}:</p>
            {employee.isBackdoorEmployee ? (
              <CheckIcon className="text-green" />
            ) : (
              <CloseIcon className="text-red" />
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderEmployees = () => (
    <div>
      <h1 className="font-mont-bd text-md">{t('customer-service.restaurant-details.employees')}</h1>
      {employees.length > 0 ? (
        employees.map(employee => renderEmployeeDetails(employee))
      ) : (
        <p className="text-sm text-grey-3">
          {t('customer-service.restaurant-details.no-employees')}
        </p>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="text-center">
        <p className="text-grey-5">
          {t('customer-service.restaurant-details.no-restaurant-details')}
        </p>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col">
      <h1 className="text-lg font-semibold p-2">
        {t('customer-service.restaurant-details.restaurant-details')}
      </h1>

      <div className="flex h-full w-full gap-4 bg-grey-1 dark:bg-grey-5 overflow-hidden">
        <div className="flex flex-col gap-4 h-full w-1/2 overflow-hidden">
          <div className="flex h-[40%] bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={getImage(restaurant.logo, DefaultImage)}
              alt={`${restaurant.name} Logo`}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="overflow-y-auto scroll flex flex-col bg-white dark:bg-black rounded-lg p-4 shadow-md h-[70%] overflow-y-auto">
            {renderEmployees()}
          </div>
        </div>

        <Details />
      </div>
    </div>
  )
}

export default RestaurantDetails
