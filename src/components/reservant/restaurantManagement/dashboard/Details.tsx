import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, CircularProgress, IconButton } from '@mui/material'
import { fetchGET, fetchPOST, getImage } from '../../../../services/APIconn'
import { RestaurantDetailsType } from '../../../../services/types'
import Dialog from '../../../reusableComponents/Dialog'
import DefaultImage from '../../../../assets/images/no-image.png'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'

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

  return (
    <div className="flex h-full self-start overflow-y-auto scroll flex-col w-full dark:bg-black bg-white rounded-lg dark:text-grey-1 p-4 ">
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
              {t('restaurant-management.details.verified')}:{' '}
            </p>
            <p>
              {restaurant.isVerified
                ? t('restaurant-management.details.yes')
                : t('restaurant-management.details.no')}
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {' '}
              {t('restaurant-management.details.archived')}:{' '}
            </p>
            <p>
              {restaurant.isArchived
                ? t('restaurant-management.details.yes')
                : t('restaurant-management.details.no')}
            </p>
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
              {restaurant.rating ?? 0} / 5 ({restaurant.numberReviews ?? 0}{' '}
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
          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {t('restaurant-management.details.max-reservation-duration')}:{' '}
            </p>
            <p>
              {restaurant.maxReservationDurationMinutes}{' '}
              {t('restaurant-management.details.minutes')}
            </p>
          </div>

          <div className="flex gap-3 text-sm">
            <p className="font-mont-bd">
              {t('restaurant-management.details.tables')}:{' '}
            </p>
            <p>
              {restaurant.tables.length}{' '}
              {t('restaurant-management.details.tables')} (
              {t('restaurant-management.details.total-capacity')}:{' '}
              {restaurant.tables.reduce(
                (acc: number, table: { capacity: number }) =>
                  acc + table.capacity,
                0
              )}
              )
            </p>
          </div>

          <div>
            <p className="font-mont-bd">
              {t('restaurant-management.details.opening-hours')}:{' '}
            </p>
            <ul className="text-sm text-grey-4 dark:text-grey-2 mt-2">
              {restaurant.openingHours.map(
                (hours: { from: string; until: string }, index: number) => (
                  <li key={index}>
                    {hours.from} - {hours.until}
                  </li>
                )
              )}
            </ul>
          </div>
          <h1>Files:</h1>
          <Link
            to={`${process.env.REACT_APP_SERVER_IP}${restaurant.rentalContract}`}
          >
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              {t('restaurant-management.details.rental')}{' '}
            </h1>
          </Link>
          <Link
            to={`${process.env.REACT_APP_SERVER_IP}${restaurant.alcoholLicense}`}
          >
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              {t('restaurant-management.details.alcohol')}{' '}
            </h1>
          </Link>
          <Link
            to={`${process.env.REACT_APP_SERVER_IP}${restaurant.businessPermission}`}
          >
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              {t('restaurant-management.details.permission')}{' '}
            </h1>
          </Link>
          <Link to={`${process.env.REACT_APP_SERVER_IP}${restaurant.idCard}`}>
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
          {isCustomerSupportManager() && !restaurant.isVerified && (
            <button
              onClick={async () => {
                try {
                  fetchPOST(`/restaurants/${restaurantId}/verify`)
                  restaurant.isVerified = true
                  setAlertMessage('restaurant accepted')
                } catch (error) {
                  console.error('Error occured during verification:', error)
                }
              }}
              className="w-fit px-4 py-1 justify-self-right dark:bg-black border-[1px] rounded-md bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            >
              {t('restaurant-management.details.accept')}{' '}
            </button>
          )}
        </div>
      ) : (
        <p className="text-center text-grey-5">
          {t('restaurant-management.details.nodata')}
        </p>
      )}
      {alertMessage && (
        <div className="fixed bottom-2 left-2">
          <Alert
            variant="filled"
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertMessage('')
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertMessage}
          </Alert>
        </div>
      )}{' '}
    </div>
  )
}

export default Details
