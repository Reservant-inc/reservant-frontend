import React, { useEffect, useState } from 'react'
import { IconButton, CircularProgress, ListItemButton } from '@mui/material'
import EditCalendarIcon from '@mui/icons-material/EditCalendar'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import EventIcon from '@mui/icons-material/Event'
import CloseIcon from '@mui/icons-material/Close'
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining'
import MopedIcon from '@mui/icons-material/Moped'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { fetchGET, getImage } from '../../services/APIconn'
import { RestaurantDetailsType, ReviewType } from '../../services/types'
import CustomRating from '../reusableComponents/CustomRating'
import Carousel from '../reusableComponents/ImageCarousel/Carousel'
import DefaultImage from '../../assets/images/defaulImage.jpeg'
import Dialog from '../reusableComponents/Dialog'
import MenuList from '../reservant/restaurantManagement/menus/MenuList'
import { MenuScreenType } from '../../services/enums'

interface FocusedRestaurantDetailsProps {
  activeRestaurant: RestaurantDetailsType
  onClose: () => void
}

const FocusedRestaurantDetails: React.FC<FocusedRestaurantDetailsProps> = ({
  activeRestaurant,
  onClose
}) => {
  const [restaurant, setRestaurant] =
    useState<RestaurantDetailsType>(activeRestaurant)
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const navigate = useNavigate()

  const [t] = useTranslation('global')

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await fetchGET(
          `/restaurants/${activeRestaurant.restaurantId}`
        )
        setRestaurant(data)
      } catch (error) {
        console.error('Error fetching restaurant details:', error)
      }
    }

    const fetchRestaurantReviews = async () => {
      try {
        const data = await fetchGET(
          `/restaurants/${activeRestaurant.restaurantId}/reviews`
        )
        setReviews(data.items || [])
      } catch (error) {
        console.error('Error fetching restaurant reviews:', error)
      }
    }

    fetchRestaurantDetails()
    fetchRestaurantReviews()
  }, [activeRestaurant])

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
    : 0

    const formatOpeningHours = (openingHours: ({ from: string | null; until: string | null } | null)[]): string[] => {
      if (!openingHours || openingHours.length !== 7) return [''];
    
      const days = [
        t('general.monday'),
        t('general.tuesday'),
        t('general.wednesday'),
        t('general.thursday'),
        t('general.friday'),
        t('general.saturday'),
        t('general.sunday'),
      ];
    
      let formattedHours: string[] = [];
      let currentRange: { start: string; end: string; hours: string } | null = null;
    
      for (let i = 0; i < openingHours.length; i++) {
        const day = days[i];
        const hours = openingHours[i];
    
        if (!hours || hours.from === null || hours.until === null) {
          // Jeśli natrafimy na dzień z null/null, to zamykamy poprzedni zakres
          if (currentRange) {
            formattedHours.push(
              `${currentRange.start}${currentRange.end !== currentRange.start ? '-' + currentRange.end : ''}: ${currentRange.hours}`
            );
            currentRange = null;
          }
          continue;
        }
    
        const hoursString = `${t('general.from')} ${hours.from} ${t('general.until')} ${hours.until}`;
    
        if (currentRange && currentRange.hours === hoursString) {
          currentRange.end = day;
        } else {
          if (currentRange) {
            formattedHours.push(
              `${currentRange.start}${currentRange.end !== currentRange.start ? '-' + currentRange.end : ''}: ${currentRange.hours}`
            );
          }
          currentRange = { start: day, end: day, hours: hoursString };
        }
      }
    
      // Jeśli po pętli nadal mamy aktywny zakres, dodajemy go do listy
      if (currentRange) {
        formattedHours.push(
          `${currentRange.start}${currentRange.end !== currentRange.start ? '-' + currentRange.end : ''}: ${currentRange.hours}`
        );
      }
    
      return formattedHours;
    };
    

  const renderRestaurantDetails = () => {
    return (
      <div className="flex w-full flex-col gap-2 p-3">
        <div className="flex w-full items-center justify-between gap-5">
          <h2 className="text-2xl font-bold dark:text-white">
            {restaurant.name}
          </h2>
          <div className="flex items-center gap-2 dark:text-white">
            <h1>{averageRating.toFixed(2)}</h1>
            <CustomRating rating={averageRating} readOnly={true} />
            <h1>({reviews.length})</h1>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-sm dark:text-white">
            {restaurant.address}, {restaurant.city}
          </h1>
          <div className="text-sm dark:text-white">
            <h1 className="font-bold">{t('restaurant-management.details.opening-hours')}:</h1>
            {formatOpeningHours(restaurant.openingHours).map((line: string, index: number) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm">
            {restaurant.provideDelivery && (
              <div className="flex items-center gap-2">
                <MopedIcon className="h-5 w-5 dark:text-white" />
                <h1 className="dark:text-white">
                  {t('home-page.delivery-fee')} 5,99 zł
                </h1>
              </div>
            )}
            <div className="flex items-center gap-1">
              <h1 className="dark:text-white">
                {t('home-page.is-delivering')}:
              </h1>
              {restaurant.provideDelivery ? (
                <CheckCircleIcon className="text-green-500 h-5 w-5 dark:text-white" />
              ) : (
                <CancelIcon className="text-red-500 h-5 w-5 dark:text-white" />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {!restaurant ? (
        <CircularProgress className="h-8 w-8 text-grey-0" />
      ) : (
        <>
          <div className="relative">
            <IconButton
              onClick={onClose}
              className="absolute right-2 top-2 z-10 h-8 w-8 bg-white dark:bg-grey-5 dark:text-grey-1"
            >
              <CloseIcon />
            </IconButton>
            <div className="h-[250px] w-full">
              {restaurant && (
                <Carousel
                  images={[restaurant.logo, ...(restaurant.photos || [])]}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            {renderRestaurantDetails()}
            <span className="h-[1px] w-full bg-grey-1 dark:bg-grey-4"></span>

            {/* Przyciski do rezerwacji, menu, tworzenia eventu i zamówienia */}
            <div className="flex w-full justify-around gap-2 rounded-lg p-3">
              <div className="flex h-full w-[70px] flex-col items-center gap-1">
                <button
                  id='reservation-guest'
                  className="h-12 w-12 rounded-full border-[1px] border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                  onClick={() => navigate('login')}
                >
                  <EditCalendarIcon className="h-6 w-6" />
                </button>
                <div className="flex h-[30px] items-center justify-center">
                  <h1 className="text-center text-[11px] text-primary dark:text-secondary">
                    {t('home-page.reservation')}
                  </h1>
                </div>
              </div>
              <div className="flex h-full w-[70px] flex-col items-center gap-1">
                <button
                  id='events-guest'
                  className="h-12 w-12 rounded-full border-[1px] border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                  onClick={() => navigate('login')}
                >
                  <EventIcon className="h-6 w-6" />
                </button>
                <div className="flex h-[30px] items-center justify-center">
                  <h1 className="text-center text-[11px] text-primary dark:text-secondary">
                    {t('home-page.create-event')}
                  </h1>
                </div>
              </div>
              <div className="flex h-full w-[70px] flex-col items-center gap-1">
                <button
                  id='menu-guest'
                  className="h-12 w-12 rounded-full border-[1px] border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                  onClick={() => setShowMenu(true)}
                >
                  <RestaurantMenuIcon className="h-6 w-6" />
                </button>
                <div className="flex h-[30px] items-center justify-center">
                  <h1 className="text-center text-[11px] text-primary dark:text-secondary">
                    Menu
                  </h1>
                </div>
              </div>
              {restaurant.provideDelivery && (
                <div className="flex h-full w-[70px] flex-col items-center gap-1">
                  <button
                    className="h-12 w-12 rounded-full border-[1px] border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                    onClick={() => navigate('login')}
                  >
                    <DeliveryDiningIcon className="h-6 w-6" />
                  </button>
                  <div className="flex h-[30px] items-center justify-center">
                    <h1 className="text-center text-[11px] text-primary dark:text-secondary">
                      {t('home-page.order')}
                    </h1>
                  </div>
                </div>
              )}
            </div>
          </div>

          {showMenu && (
            <Dialog
              open={showMenu !== null}
              onClose={() => setShowMenu(false)}
              title={'Menu'}
            >
              <div className="gap- flex h-[calc(100%-2.25rem)] min-w-[600px] flex-col items-center rounded-lg bg-white p-3 dark:bg-black">
                <div className="flex h-[15%] w-full items-center gap-4">
                  <img
                    src={getImage(restaurant.logo, DefaultImage)}
                    className="h-[6rem] w-[6rem] rounded-lg"
                  />
                  <div className="flex w-[80%] flex-col justify-between">
                    <h2 className="text-xl font-bold dark:text-white">
                      {restaurant.name}
                    </h2>
                    <div className="flex items-center gap-2 dark:text-white">
                      <h1 className="text-[16px]">
                        {averageRating.toFixed(2)}
                      </h1>
                      <CustomRating
                        rating={averageRating}
                        readOnly={true}
                        className="text-[18px]"
                      />
                      <h1 className="text-[16px]">({reviews.length})</h1>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h1 className="text-[14px] dark:text-white">
                        {restaurant.address}, {restaurant.city}
                      </h1>
                      <div className="flex items-center gap-3 text-[14px]">
                        {restaurant.provideDelivery && (
                          <div className="flex items-center gap-2">
                            <MopedIcon className="h-4 w-4 dark:text-white" />
                            <h1 className="text-[14px] dark:text-white">
                              {t('home-page.delivery-fee')} 5,99 zł
                            </h1>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <h1 className="text-[12px] dark:text-white">
                            {t('home-page.is-delivering')}:
                          </h1>
                          {restaurant.provideDelivery ? (
                            <CheckCircleIcon className="text-green-500 h-4 w-4 dark:text-white" />
                          ) : (
                            <CancelIcon className="text-red-500 h-4 w-4 dark:text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[85%] w-full">
                  <MenuList
                    activeRestaurantId={activeRestaurant.restaurantId}
                    type={MenuScreenType.Preview}
                  />
                </div>
              </div>
            </Dialog>
          )}
        </>
      )}
    </>
  )
}

export default FocusedRestaurantDetails
