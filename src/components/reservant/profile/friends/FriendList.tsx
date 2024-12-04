import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { fetchGET } from '../../../../services/APIconn'
import { PaginationType, FriendData } from '../../../../services/types'
import { FriendListType } from '../../../../services/enums'
import Friend from './Friend'
import { useTranslation } from 'react-i18next'

interface FriendListProps {
  listType: FriendListType
}

const FriendList: React.FC<FriendListProps> = ({ listType }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [friends, setFriends] = useState<FriendData[]>([])
  const [filteredFriends, setFilteredFriends] = useState<FriendData[]>([])

  const location = useLocation()
  const [t] = useTranslation('global')

  const apiRoutes: Record<FriendListType, string> = {
    [FriendListType.List]: '/friends',
    [FriendListType.Outgoing]: '/friends/outgoing',
    [FriendListType.Incoming]: '/friends/incoming'
  }

  const noFriendsMessage: Record<FriendListType, string> = {
    [FriendListType.List]: t('profile.friends.no-friends-message'),
    [FriendListType.Outgoing]: t('profile.friends.no-outgoing-message'),
    [FriendListType.Incoming]: t('profile.friends.no-incoming-message')
  }

  const apiRoute = apiRoutes[listType]

  useEffect(() => {
    fetchFriends()
  }, [location])

  const fetchFriends = async () => {
    try {
      const response: PaginationType = await fetchGET(apiRoute)
      const data: FriendData[] = response.items as unknown as FriendData[]
      setFriends(data)
      setFilteredFriends(data)
    } catch (error) {
      console.error('Error fetching friends:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshFriends = () => {
    fetchFriends()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setFilteredFriends(
      query.length >= 3
        ? friends.filter(friend =>
            `${friend.otherUser.firstName} ${friend.otherUser.lastName}`
              .toLowerCase()
              .includes(query)
          )
        : friends
    )
  }

  return (
    <div className="flex flex-col bg-white rounded-lg w-full h-full dark:bg-black">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex w-full items-center rounded-full border-[1px] border-grey-1 px-1 font-mont-md dark:border-grey-6">
          <input
            id='profileFriendsFilterInput'
            type="text"
            placeholder={`${t('profile.friends.friend-search-input')}`}
            className="w-full placeholder:text-grey-2 dark:text-grey-0"
            onChange={handleSearchChange}
          />
          <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
        </div>

        <div className="flex flex-col h-full gap-2 pr-2 overflow-y-auto scroll">
          {filteredFriends.length === 0 ? (
            <p className="italic text-center dark:text-white">{noFriendsMessage[listType]}</p>
          ) : (
            filteredFriends.map(friend => (
              <Friend
                key={friend.otherUser.userId}
                friend={friend}
                listType={listType}
                refreshFriends={refreshFriends}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default FriendList
