import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, CircularProgress } from '@mui/material'
import { fetchGET, fetchPOST, getImage } from '../../../../services/APIconn'
import { RestaurantDetailsType } from '../../../../services/types'
import Dialog from '../../../reusableComponents/Dialog'
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'

const Details: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType | null>(
    null
  )
  const [t] = useTranslation('global')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [logoOpen, setLogoOpen] = useState<boolean>(false)

  const isCustomerSupportManager = () => {
    if (Cookies.get('userInfo'))
      return Boolean(
        JSON.parse(Cookies.get('userInfo') as string).roles.includes(
          'CustomerSupportManager'
        )
      )
    return false
  }
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

  const handleAccept = async () => {
    fetchPOST(`/restaurants/${restaurantId}/verify`)
    setAlertMessage('restaurant accepted')
  }

  return (
    <div className="flex h-full self-start overflow-y-auto flex-col w-full dark:bg-black bg-white rounded-lg p-4 ">
      <h1 className="text-lg font-mont-bd">
        {t('restaurant-management.details.details')}
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : restaurant ? (
        <div className="space-y-4">
          <p className="text-sm text-grey-4 dark:text-grey-2">
            {t('restaurant-management.details.id')}: {restaurant.restaurantId}
          </p>
          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {' '}
              {t('restaurant-management.details.name')}:{' '}
            </p>
            <p>{restaurant.name}</p>
          </div>
          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {' '}
              {t('restaurant-management.details.type')}:{' '}
            </p>
            <p>{restaurant.restaurantType}</p>
          </div>
          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {' '}
              {t('restaurant-management.details.address')}:{' '}
            </p>
            <p>
              {restaurant.address}, {restaurant.postalIndex}, {restaurant.city}
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {' '}
              {t('restaurant-management.details.location')}:{' '}
            </p>
            <p>
              Lat {restaurant.location.latitude}, Lng{' '}
              {restaurant.location.longitude}
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {' '}
              {t('restaurant-management.details.delivery')}:{' '}
            </p>
            <p>
              {restaurant.provideDelivery
                ? t('restaurant-management.details.yes')
                : t('restaurant-management.details.no')}
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {' '}
              {t('restaurant-management.details.description')}:{' '}
            </p>
            <p>{restaurant.description}</p>
          </div>

          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {' '}
              {t('restaurant-management.details.rating')}:{' '}
            </p>
            <p>
              {restaurant.rating} / 5 ({restaurant.numberReviews}{' '}
              {t('restaurant-management.details.reviews')})
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {' '}
              {t('restaurant-management.details.tags')}:{' '}
            </p>
            <p>{restaurant.tags.join(', ')} </p>
          </div>
          <h1>Files:</h1>
          <Link to={``}>
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              {t('restaurant-management.details.rental')}{' '}
            </h1>
          </Link>
          <Link to={``}>
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              {t('restaurant-management.details.alcohol')}{' '}
            </h1>
          </Link>
          <Link to={``}>
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              {t('restaurant-management.details.permission')}{' '}
            </h1>
          </Link>
          <Link to={``}>
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              {t('restaurant-management.details.idcard')}{' '}
            </h1>
          </Link>
          <Link to="" onClick={() => setLogoOpen(true)}>
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              Logo
            </h1>
          </Link>
          {logoOpen && (
            <Dialog
              open={logoOpen}
              title="Logo preview"
              onClose={() => setLogoOpen(false)}
            >
              <div className="w-[500px] flex items-center justify-center p-1 h-[500px]">
                <img
                  src={getImage(restaurant.logo, DefaultImage)}
                  className="h-fit w-fit rounded-lg"
                />
              </div>
            </Dialog>
          )}
          {isCustomerSupportManager() && (
            <button
              onClick={handleAccept}
              className="w-fit px-4 py-1 justify-self-right dark:bg-black border-[1px] rounded-md bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            >
              {t('restaurant-management.details.accept')}{' '}
            </button>
          )}
        </div>
      ) : (
        <p className="text-center text-grey-5">
          {' '}
          {t('restaurant-management.details.nodata')}
        </p>
      )}
      {alertMessage && <Alert>{alertMessage}</Alert>}
    </div>
  )
}

export default Details
