import React, { useState, useEffect, useRef, useContext } from 'react'
import { fetchGET } from '../../../../../services/APIconn'
import SearchIcon from '@mui/icons-material/Search'
import OutsideClickHandler from '../../../../reusableComponents/OutsideClickHandler'
import { CircularProgress } from '@mui/material'
import {
  PaginationType,
  UserSearchType,
  RestaurantType
} from '../../../../../services/types'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FetchError } from '../../../../../services/Errors'
import { useTranslation } from 'react-i18next'
import SearchedFriend from './SearchedFriend'
import SearchedUser from '../../../../customerService/users/SearchedUser'
import SearchedRestaurant from '../../../../customerService/restaurants/SearchedRestaurant' // Import a new component to render restaurant results
import { ThemeContext } from '../../../../../contexts/ThemeContext'
import { Cached } from '@mui/icons-material'

interface SearchBarProps {
  isCustomerService: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ isCustomerService }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [users, setUsers] = useState<UserSearchType[]>([])
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isResutNotExist, setIsResultNotExist] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [t] = useTranslation('global')

  const pressHandler = async () => {
    setIsPressed(!isPressed)
  }

  const fetchUsersAndRestaurants = async (name: string, page: number) => {
    try {
      if (page === 0) setIsLoading(true)

      // Fetch users
      const userResult: PaginationType = await fetchGET(
        `/users?name=${name}&page=${page}&perPage=10`
      )
      const newUsers = userResult.items as UserSearchType[]

      // Fetch restaurants
      const restaurantResult: PaginationType = await fetchGET(
        `/restaurants?name=${name}&page=${page}&perPage=10`
      )
      const newRestaurants =
        restaurantResult.items as unknown as RestaurantType[]

      console.log(restaurantResult)

      if (newUsers.length < 10 && newRestaurants.length < 10) {
        setHasMore(false)
      }

      if (newUsers.length === 0 || newRestaurants.length === 0) {
        setIsResultNotExist(true)
      }

      if (page > 0) {
        setUsers(prevUsers => [...prevUsers, ...newUsers])
        setRestaurants(prevRestaurants => [
          ...prevRestaurants,
          ...newRestaurants
        ])
      } else {
        setUsers(newUsers)
        setRestaurants(newRestaurants)
      }
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    if (searchTerm.length >= 1) {
      fetchUsersAndRestaurants(searchTerm, page)
    } else {
      setUsers([])
      setRestaurants([])
    }
  }, [searchTerm, page])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setSearchTerm(name)
    setPage(0)
    setHasMore(true)
  }

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <div className="flex h-10 w-full items-center rounded-full border-[1px] border-grey-1 dark:border-grey-6 bg-grey-0 dark:bg-grey-5 px-2 font-mont-md">
        <input
          type="text"
          ref={inputRef}
          placeholder={t('friends.search')}
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => {
            if (!isPressed) setIsPressed(!isPressed)
          }}
          className="clean-input h-8 w-[250px] p-2 placeholder:text-grey-2 dark:text-grey-1"
        />
        {searchTerm !== 'sekude' ? (
          <span onClick={handleInputFocus}>
            <SearchIcon className="h-[25px] w-[25px] hover:cursor-pointer dark:text-grey-2" />
          </span>
        ) : (
          <span
            onClick={() => document.documentElement.classList.toggle('sekude')}
          >
            <Cached className="hover:animate-spin h-[25px] w-[25px] hover:cursor-pointer dark:text-grey-2" />
          </span>
        )}
      </div>
      {isPressed && (
        <div
          className={
            isCustomerService
              ? 'absolute z-[2] right-0 top-0 w-[580px]'
              : 'absolute z-[2] right-0 top-0 w-[450px]'
          }
        >
          {users.length > 0 || restaurants.length > 0 ? (
            <div className="nav-dropdown flex flex-col w-full items-start overflow-y-hidden dark:bg-black">
              {/* Nagłówki */}
              <div className="custom-transition flex w-full px-3 py-4">
                <h1 className="font-mont-bd text-xl dark:text-white">
                  {t('general.results')}
                </h1>
              </div>

              {/* Wyświetlanie wyników */}
              <div
                id="scrollableDiv"
                className={`scroll flex h-[300px] w-full overflow-y-auto ${
                  isCustomerService ? '' : 'flex-col' // Flexbox: kolumny dla customer service, jedna kolumna dla znajomych
                }`}
              >
                {/* Sekcja użytkowników */}
                <div
                  className={isCustomerService ? 'w-1/2 px-2' : 'w-full px-2'}
                >
                  <h2 className="font-mont-md text-lg dark:text-white px-2">
                    {isCustomerService ? t('general.users') : ''}
                  </h2>
                  <InfiniteScroll
                    dataLength={users.length}
                    next={() => setPage(prevPage => prevPage + 1)}
                    hasMore={hasMore}
                    loader={<CircularProgress />}
                    scrollableTarget="scrollableDiv"
                    className="hidescroll"
                  >
                    {users.map((user, index) => (
                      <div
                        key={`user-${index}`}
                        className={`rounded-lg px-2 py-1 hover:bg-grey-0 dark:hover:bg-grey-5 ${
                          isCustomerService ? 'w-full' : 'w-full'
                        }`}
                      >
                        {isCustomerService ? (
                          <SearchedUser user={user} />
                        ) : (
                          <SearchedFriend user={user} />
                        )}
                      </div>
                    ))}
                  </InfiniteScroll>
                </div>

                {/* Sekcja restauracji */}
                {isCustomerService && (
                  <div className="w-1/2 px-2">
                    <h2 className="font-mont-md text-lg dark:text-white">
                      {t('general.restaurants')}
                    </h2>
                    <InfiniteScroll
                      dataLength={restaurants.length}
                      next={() => setPage(prevPage => prevPage + 1)}
                      hasMore={hasMore}
                      loader={<CircularProgress />}
                      scrollableTarget="scrollableDiv"
                      className="hidescroll"
                    >
                      {restaurants.map((restaurant, index) => (
                        <div
                          key={`restaurant-${index}`}
                          className="w-full rounded-lg px-2 py-1 hover:bg-grey-0 dark:hover:bg-grey-5"
                        >
                          <SearchedRestaurant restaurant={restaurant} />
                        </div>
                      ))}
                    </InfiniteScroll>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="nav-dropdown flex h-[3rem] w-[290px] items-center justify-center dark:bg-black">
                  <div className="flex flex-col items-center gap-2">
                    <CircularProgress className="h-8 w-8 text-grey-2" />
                  </div>
                </div>
              ) : (
                isResutNotExist && (
                  <div className="nav-dropdown flex flex-col items-center justify-center h-[3rem] w-[290px] dark:bg-black">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <h1 className="text-center text-sm italic text-grey-3">
                        {t('general.no-results')}
                      </h1>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>
      )}
    </OutsideClickHandler>
  )
}

export default SearchBar
