import React, { useState, useEffect } from 'react'
import { fetchGET } from '../../../../../services/APIconn'
import SearchIcon from '@mui/icons-material/Search'
import OutsideClickHandler from '../../../../reusableComponents/OutsideClickHandler'
import { CircularProgress } from '@mui/material'
import { PaginationType, UserSearchType } from '../../../../../services/types'
import SearchedUser from './SearchedUser'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FetchError } from '../../../../../services/Errors'
import { useTranslation } from 'react-i18next'
import Search from '../../../../reusableComponents/Search'

const FriendSearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [users, setUsers] = useState<UserSearchType[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false)
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const [t] = useTranslation('global')

  const fetchUsers = async (name: string, page: number) => {
    try {
      if (page === 0) setIsLoadingUsers(true)

      const result: PaginationType = await fetchGET(
        `/users?name=${name}&page=${page}&perPage=10`
      )
      const newUsers = result.items as UserSearchType[]

      if (newUsers.length < 10) setHasMore(false)

      if (page > 0) {
        setUsers(prevUsers => [...prevUsers, ...newUsers])
      } else {
        setUsers(newUsers)
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

  useEffect(() => {
    if (searchTerm.length >= 1) {
      fetchUsers(searchTerm, page)
    } else {
      setUsers([])
    }
  }, [searchTerm, page])

  const handleSearch = (query: string) => {
    setSearchTerm(query)
    setPage(0)
    setHasMore(true)
  }

  const pressHandler = async () => {
    setIsPressed(!isPressed)
  }

  const onFocus = () => {
    if (!isPressed) setIsPressed(true)
  }

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <Search
        filter={handleSearch}
        onFocus={onFocus}
        placeholder={t('friends.search')}
      />

      {isPressed && (
        <div className="absolute z-[2] right-0 top-0 w-[460px]">
          {users.length > 0 ? (
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
                  dataLength={users.length}
                  next={() => setPage(prevPage => prevPage + 1)}
                  hasMore={hasMore}
                  loader={<CircularProgress />}
                  scrollableTarget="scrollableDiv"
                  className="hidescroll px-2"
                >
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="w-full rounded-lg px-2 py-1 hover:bg-grey-0 dark:hover:bg-grey-5"
                    >
                      <SearchedUser user={user} />
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

export default FriendSearchBar
