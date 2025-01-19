import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { fetchGET, getImage } from '../../../services/APIconn'
import DefaultImage from '../../../assets/images/user.jpg'
import Details from '../../reservant/restaurantManagement/dashboard/Details'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const RestaurantDetails: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

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
    <div key={employee.employeeId} className="p-4 bg-white my-2">
      <div className="flex justify-between items-center">
        <h1 className="font-mont-bd text-md">{`${employee.firstName} ${employee.lastName}`}</h1>
        <Link to={`/customer-service/users/${employee.employeeId}`}>
          <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
            Go to Profile
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
            {employee.employeeId}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm">Hall:</p>
            {employee.isHallEmployee ? (
              <CheckIcon className="text-green" />
            ) : (
              <CloseIcon className="text-red" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm">Backdoor:</p>
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
      <h1 className="font-mont-bd text-md">Employees</h1>
      {employees.length > 0 ? (
        employees.map(employee => renderEmployeeDetails(employee))
      ) : (
        <p className="text-sm text-grey-3">No employees found.</p>
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
        <p className="text-grey-5">No restaurant details available.</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Nagłówek wyświetlany nad resztą */}
      <h1 className="text-lg font-semibold p-2">Restaurant details</h1>
  
      {/* Reszta strony */}
      <div className="flex h-full w-full gap-4 bg-grey-1 dark:bg-grey-5 overflow-hidden">
        {/* Lewa kolumna */}
        <div className="flex flex-col gap-4 h-full w-1/2 overflow-hidden">
          {/* Logo */}
          <div className="flex h-[40%] bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={getImage(restaurant.logo, DefaultImage)}
              alt={`${restaurant.name} Logo`}
              className="object-cover w-full h-full"
            />
          </div>
  
          {/* Lista pracowników */}
          <div className="flex flex-col bg-white dark:bg-black rounded-lg p-4 shadow-md h-[70%] overflow-y-auto">
            {renderEmployees()}
          </div>
        </div>
  
        {/* Prawa kolumna */}
        <Details />
      </div>
    </div>
  )
}

export default RestaurantDetails
