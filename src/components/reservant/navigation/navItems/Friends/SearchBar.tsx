import React, { useState, useEffect, useRef } from 'react'
import { fetchGET } from '../../../../../services/APIconn'
import SearchIcon from '@mui/icons-material/Search'
import OutsideClickHandler from '../../../../reusableComponents/OutsideClickHandler'
import { CircularProgress } from '@mui/material'
import { PaginationType, UserSearchType, RestaurantType } from '../../../../../services/types'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FetchError } from '../../../../../services/Errors'
import { useTranslation } from 'react-i18next'
import SearchedFriend from './SearchedFriend'
import SearchedUser from '../../../../customerService/users/SearchedUser'
import SearchedRestaurant from '../../../../customerService/restaurants/SearchedRestaurant' // Import a new component to render restaurant results

interface SearchBarProps {
  isCustomerService: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ isCustomerService }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [users, setUsers] = useState<UserSearchType[]>([])
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false)
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const [t] = useTranslation('global')

  const pressHandler = async () => {
    setIsPressed(!isPressed)
  }

  const fetchUsersAndRestaurants = async (name: string, page: number) => {
    try {
      if (page === 0) setIsLoadingUsers(true)

      // Fetch users
      const userResult: PaginationType = await fetchGET(
        `/users?name=${name}&page=${page}&perPage=10`
      )
      const newUsers = userResult.items as UserSearchType[]

      // Fetch restaurants
      const restaurantResult: PaginationType = await fetchGET(
        `/restaurants?name=${name}&page=${page}&perPage=10`
      )
      const newRestaurants = (restaurantResult.items as unknown) as RestaurantType[]


      if (newUsers.length < 10 && newRestaurants.length < 10) {
        setHasMore(false)
      }

      if (page > 0) {
        setUsers(prevUsers => [...prevUsers, ...newUsers])
        setRestaurants(prevRestaurants => [...prevRestaurants, ...newRestaurants])
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
      setIsLoadingUsers(false)
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
        <span onClick={handleInputFocus}>
          <SearchIcon className="h-[25px] w-[25px] hover:cursor-pointer dark:text-grey-2" />
        </span>
      </div>
      {isPressed && (
        <div className="absolute z-[2] right-0 top-0 w-[460px]">
          {users.length > 0 || restaurants.length > 0 ? (
            <div className="nav-dropdown scroll left-0 flex h-[15rem] w-[450px] items-center overflow-y-hidden dark:bg-black">
              <div className="custom-transition flex h-14 w-full items-center justify-between px-3 py-4">
                <h1 className="font-mont-bd text-xl dark:text-white">
                  {t('general.results')}
                </h1>
              </div>
              <div
                id="scrollableDiv"
                className="scroll h-full w-full overflow-y-auto"
              >
                <InfiniteScroll
                  dataLength={users.length + restaurants.length}
                  next={() => setPage(prevPage => prevPage + 1)}
                  hasMore={hasMore}
                  loader={<CircularProgress />}
                  scrollableTarget="scrollableDiv"
                  className="hidescroll px-2"
                >
                  {users.map((user, index) => (
                    <div
                      key={`user-${index}`}
                      className="w-full rounded-lg px-2 py-1 hover:bg-grey-0 dark:hover:bg-grey-5"
                    >
                      {isCustomerService ? (
                        <SearchedUser user={user} />
                      ) : (
                        <SearchedFriend user={user} />
                      )}
                    </div>
                  ))}
                  {isCustomerService && restaurants.map((restaurant, index) => (
                    <div
                      key={`restaurant-${index}`}
                      className="w-full rounded-lg px-2 py-1 hover:bg-grey-0 dark:hover:bg-grey-5"
                    >
                      <SearchedRestaurant restaurant={restaurant} />
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          ) : (
            <>
              {isLoadingUsers ? (
                <div className="nav-dropdown left-0 flex h-[3rem] w-[290px] items-center justify-center dark:bg-black">
                  <div className="flex flex-col items-center gap-2">
                    <CircularProgress className="h-8 w-8 text-grey-2" />
                  </div>
                </div>
              ) : (
                searchTerm.length > 0 && (
                  <div className="nav-dropdown left-0 flex h-[3rem] w-[290px] items-center justify-center dark:bg-black">
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
