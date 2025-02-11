import React, { useEffect, useState } from 'react'
import { Button, List, ListItemButton, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import StarPurple500SharpIcon from '@mui/icons-material/StarPurple500Sharp'
import LocalOfferSharpIcon from '@mui/icons-material/LocalOfferSharp'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { useTranslation } from 'react-i18next'
import { fetchGET, getImage } from '../../services/APIconn'
import { FetchError } from '../../services/Errors'
import { RestaurantDetailsType } from '../../services/types'
import CustomRating from '../reusableComponents/CustomRating'
import OutsideClickHandler from '../reusableComponents/OutsideClickHandler'
import Map from '../reservant/map/Map'
import GuestFocusedRestaurantDetails from './GuestFocusedRestaurantDetails'

export default function GuestHomePage() {
  const [restaurants, setRestaurants] = useState<RestaurantDetailsType[]>([])
  const [allRestaurants, setAllRestaurants] = useState<RestaurantDetailsType[]>(
    []
  )
  const [activeRestaurant, setActiveRestaurant] =
    useState<RestaurantDetailsType | null>(null)
  const [loadedRestaurantIds, setLoadedRestaurantIds] = useState<Set<number>>(
    new Set()
  )
  const [userMovedMap, setUserMovedMap] = useState<boolean>(false)
  const [isReviewFilterPressed, setIsReviewFilterPressed] =
    useState<boolean>(false)
  const [isTagFilterPressed, setIsTagFilterPressed] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true)
  const [reviewFilter, setReviewFilter] = useState<number>(0)
  const [tags, setTags] = useState<string[]>([])
  const [chosenTags, setChosenTags] = useState<string[]>([])

  const [t] = useTranslation('global')

  //center of warsaw, cant get users location without https
  const [bounds, setBounds] = useState<any>({
    lat1: 52.25255454924618,
    lat2: 52.20718589303197,
    lon1: 21.06353759765625,
    lon2: 20.959854125976566
  })

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await fetchGET('/restaurant-tags')
        setTags(response)
      } catch (error) {
        if (error instanceof FetchError) {
          console.error(error.formatErrors())
        } else {
          console.error('Unexpected error:', error)
        }
      }
    }
    getTags()
  }, [])

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const tagsQuery = chosenTags
          .map(tag => {
            return `&tags=${tag}`
          })
          .join('')

        const response = await fetchGET(
          `/restaurants?origLat=${52.225}&origLon=${21.01}&lat1=${bounds.lat1}&lon1=${bounds.lon1}&lat2=${bounds.lat2}&lon2=${bounds.lon2}${tagsQuery}&minRating=${reviewFilter}`
        )

        const newRestaurants = response.items.filter(
          (restaurant: any) => !loadedRestaurantIds.has(restaurant.restaurantId)
        )

        setRestaurants([...restaurants, ...newRestaurants])
        setAllRestaurants([...allRestaurants, ...newRestaurants])

        setLoadedRestaurantIds(prevIds => {
          const newIds = new Set(prevIds)
          newRestaurants.forEach((restaurant: any) =>
            newIds.add(restaurant.restaurantId)
          )
          return newIds
        })
      } catch (error) {
        if (error instanceof FetchError) {
          console.error(error.formatErrors())
        } else {
          console.error('Unexpected error:', error)
        }
      }
    }
    getRestaurants()
  }, [bounds, chosenTags, reviewFilter])

  const reviewsPressHandler = () => {
    setIsReviewFilterPressed(!isReviewFilterPressed)
  }

  const tagsPressHandler = () => {
    setIsTagFilterPressed(!isTagFilterPressed)
  }

  const handleTagSelection = (tag: string) => {
    setChosenTags(prevTags => {
      const updatedTags = prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]

      // Reset restaurants and loaded IDs
      setRestaurants([])
      setLoadedRestaurantIds(new Set())
      return updatedTags
    })
  }

  return (
    <div
      id="homePage-wrapper"
      className="relative flex h-full w-full bg-grey-1 dark:bg-black"
    >
      {isMenuOpen ? (
        <div className="absolute left-[0.5rem] top-[0.5rem] z-[1] flex h-[calc(100%-1rem)] w-[300px] flex-col rounded-lg bg-white shadow-2xl dark:bg-black">
          <div className="flex h-14 w-full items-center justify-between px-3 py-2">
            <h1 className="font-mont-bd text-xl dark:text-white">
              {t('home-page.restaurants')}
            </h1>
            <Button
              className={`flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-grey-1 text-black text-black dark:bg-grey-5`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <KeyboardBackspaceIcon className="h-5 w-5 dark:text-grey-1" />
            </Button>
          </div>
          <div className="px-3 py-3">
            <div className="flex w-full items-center rounded-full border-[1px] border-grey-1 bg-grey-0 px-1 font-mont-md dark:border-grey-6 dark:bg-grey-5">
              <input
                type="text"
                placeholder={t('home-page.search')}
                className="w-full placeholder:text-grey-2"
                onChange={e => {
                  setRestaurants(
                    allRestaurants.filter((restaurant: any) => {
                      return restaurant.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    })
                  )
                }}
              />
              <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
            </div>
          </div>
          <div className="scroll h-full overflow-y-auto">
            <List
              id="homePage-restaurantList"
              className="w-full p-0 px-2 font-mont-md dark:bg-black"
            >
              {restaurants.map(restaurant => (
                <ListItemButton
                  id="homePage-listItemButton"
                  onClick={() => {
                    setUserMovedMap(false)
                    setActiveRestaurant(restaurant)
                  }}
                  className={`rounded-md p-3 dark:bg-black
                      ${
                        activeRestaurant === restaurant
                          ? ' bg-grey-1 dark:bg-grey-5'
                          : ' bg-white hover:bg-grey-1 dark:hover:bg-grey-5'
                      }
                        `}
                  key={restaurant.restaurantId}
                >
                  <div className="flex w-full items-start justify-between py-2">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-md font-mont-md dark:text-white">
                        {restaurant.name}
                      </h1>
                      <div className="flex">
                        <h1 className="text-sm dark:text-white">
                          {Math.round(
                            (restaurant.rating + Number.EPSILON) * 100
                          ) / 100}
                        </h1>
                        <CustomRating
                          rating={restaurant.rating}
                          readOnly={true}
                          className={'text-[18px]'}
                        />
                        <h1 className="text-sm dark:text-white">{`(${restaurant.numberReviews})`}</h1>
                      </div>
                      <h1 className="font-mont-l text-sm dark:text-white">
                        {restaurant.address}
                      </h1>
                      <h1 className="font-mont-l text-sm dark:text-white">
                        {restaurant.provideDelivery
                          ? t('home-page.delivery')
                          : t('home-page.no-delivery')}
                      </h1>
                      <div className="flex gap-2">
                        {restaurant.tags.map((tag: string, index: number) => (
                          <h1
                            className="font-mont-md text-sm dark:text-white"
                            key={index}
                          >
                            {tag}
                          </h1>
                        ))}
                      </div>
                    </div>
                    <img
                      src={getImage(restaurant.logo, '')}
                      alt="logo"
                      className="h-24 w-24 rounded-lg"
                    />
                  </div>
                </ListItemButton>
              ))}
            </List>
          </div>
        </div>
      ) : (
        <div className="absolute left-[0.5rem] top-[0.5rem] z-[1]">
          <Button
            id="NotificationsButton"
            className={`relative flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-white text-black shadow-md dark:bg-grey-5 dark:text-grey-1 ${isMenuOpen && 'text-primary'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <RestaurantMenuIcon className="h-6 w-6 dark:text-grey-1" />
          </Button>
        </div>
      )}
      <div
        className={`absolute top-[0.5rem] z-[2] flex items-center gap-2 ${isMenuOpen ? 'left-[calc(1rem+300px)]' : 'left-[3.5rem]'}`}
      >
        <OutsideClickHandler
          onOutsideClick={reviewsPressHandler}
          isPressed={isReviewFilterPressed}
        >
          <Button
            id="homePage-reviewsFilter"
            className={
              'flex h-10 gap-2 rounded-lg p-3 shadow-md ' +
              (reviewFilter !== 0
                ? 'bg-primary text-white dark:bg-secondary dark:text-black'
                : 'bg-white text-black dark:bg-black dark:text-white')
            }
            onClick={reviewsPressHandler}
          >
            <StarPurple500SharpIcon
              className={
                'h-6 ' +
                (reviewFilter !== 0
                  ? 'text-white dark:text-black'
                  : 'text-black dark:text-white')
              }
            />
            {reviewFilter === 0
              ? t('home-page.reviews')
              : `${reviewFilter}.0 or more`}
          </Button>
          {isReviewFilterPressed && (
            <div className="absolute top-[3rem] rounded-lg bg-white shadow-2xl dark:bg-black">
              <List
                id="homePage-restaurantList"
                className="w-full font-mont-md"
              >
                <ListItemButton
                  id="homePage-listItemButton"
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    setReviewFilter(0)
                    setIsReviewFilterPressed(false)
                  }}
                >
                  <Typography component="legend" className="dark:text-white">
                    {t('home-page.rating')}
                  </Typography>
                </ListItemButton>
                {[2, 3, 4, 5].map((value, index) => (
                  <ListItemButton
                    id="homePage-listItemButton"
                    className="flex items-center justify-center gap-2"
                    onClick={() => {
                      setReviewFilter(value)
                      setIsReviewFilterPressed(false)
                    }}
                    key={index}
                  >
                    <Typography component="legend" className="dark:text-white">
                      {value}.0
                    </Typography>
                    <CustomRating rating={value} readOnly={true} />
                  </ListItemButton>
                ))}
              </List>
            </div>
          )}
        </OutsideClickHandler>
        <OutsideClickHandler
          onOutsideClick={tagsPressHandler}
          isPressed={isTagFilterPressed}
        >
          <Button
            id="homePage-tagssFilter"
            className={
              'flex h-10 items-center justify-center gap-2 rounded-lg p-3 shadow-md ' +
              (chosenTags.length > 0
                ? 'bg-primary text-white dark:bg-secondary dark:text-black'
                : 'bg-white text-black dark:bg-black dark:text-white')
            }
            onClick={tagsPressHandler}
          >
            <LocalOfferSharpIcon
              className={
                'h-6 ' +
                (chosenTags.length > 0
                  ? 'text-white dark:text-black'
                  : 'text-black dark:text-white')
              }
            />
            {chosenTags.length > 0
              ? chosenTags.length === 1
                ? `${chosenTags.length} tag`
                : `${chosenTags.length} tags`
              : t('home-page.tags')}
            {chosenTags.length > 0 && (
              <button
                className="flex h-[20px] w-[20px] items-center rounded-full"
                onClick={() => setChosenTags([])}
              >
                <CloseSharpIcon
                  className={
                    'h-[20px] w-[20px] ' +
                    (chosenTags.length > 0
                      ? 'text-white dark:text-black'
                      : 'text-black dark:text-white')
                  }
                />
              </button>
            )}
          </Button>
          {isTagFilterPressed && (
            <div className="absolute top-[3rem] flex w-44 flex-wrap justify-start gap-2 rounded-lg bg-white p-3 shadow-2xl dark:bg-black">
              {tags.map((tag, i) => (
                <button
                  key={i}
                  className={`rounded-full border-[1px] border-grey-2 p-2 font-mont-md text-[12px] dark:border-grey-6 ${chosenTags.includes(tag) ? 'bg-primary text-white dark:bg-secondary dark:text-black' : 'bg-white text-black dark:bg-grey-5 dark:text-white'}`}
                  onClick={() => handleTagSelection(tag)}
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </OutsideClickHandler>
      </div>
      {activeRestaurant && (
        <div>
          <div
            className={`absolute top-[3.5rem] z-[1] h-fit w-[450px] overflow-y-hidden rounded-lg bg-white shadow-md ${isMenuOpen ? 'left-[calc(1rem+300px)]' : 'left-[0.5rem]'}`}
          >
            <div className="scroll h-full overflow-y-auto dark:bg-black">
              <GuestFocusedRestaurantDetails
                activeRestaurant={activeRestaurant}
                onClose={() => setActiveRestaurant(null)}
              />
            </div>
          </div>
        </div>
      )}
      <div id="map" className="relative z-[0] h-full w-full">
        <Map
          activeRestaurant={activeRestaurant}
          restaurants={restaurants}
          selectRestaurant={setActiveRestaurant}
          setBounds={setBounds}
          setUserMovedMap={setUserMovedMap}
          userMovedMap={userMovedMap}
        />
      </div>
    </div>
  )
}
