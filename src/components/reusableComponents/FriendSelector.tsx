import React, { useState } from 'react'

import { Button, CircularProgress, List, ListItemButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DefaultPhoto from '../../assets/images/user.jpg'
import { FriendType, PaginationType, UserType } from '../../services/types'
import { fetchGET, getImage } from '../../services/APIconn'
import { useTranslation } from 'react-i18next'
import { FetchError } from '../../services/Errors'
import SearchIcon from '@mui/icons-material/Search'

interface FriendSelectorProps {
  friendsToAdd: FriendType[]
  setFriendsToAdd: Function
}

const FriendSelector: React.FC<FriendSelectorProps> = ({
  friendsToAdd,
  setFriendsToAdd
}) => {
  const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(false)
  const [friendSearchQuery, setFriendSearchQuery] = useState<string>('')
  const [friends, setFriends] = useState<UserType[]>([])
  const [t] = useTranslation('global')
  const inputClass = 'clean-input py-1 px-0 text-md italic dark:text-white'

  const fetchFriends = async (name: string) => {
    try {
      setIsLoadingFriends(true)

      const result: PaginationType = await fetchGET(
        `/users?name=${name}&filter=friendsOnly`
      )
      const val: UserType[] = result.items as UserType[]
      const filteredResult = val.filter(
        (newFriend: UserType) =>
          !friendsToAdd.some(friend => friend.userId === newFriend.userId)
      )

      setFriends(filteredResult)
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error:', error)
      }
    } finally {
      setIsLoadingFriends(false)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    if (name.length >= 1) fetchFriends(name)
    else setFriends([])
  }
  const handleDeleteFriendToAdd = (id: string) => {
    const filtered = friendsToAdd.filter(friend => friend.userId !== id)
    setFriendsToAdd(filtered)
  }

  const onFriendSelect = async (friendToAdd: UserType) => {
    setFriendsToAdd([...friendsToAdd, friendToAdd])
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex h-10 w-full items-center rounded-full border-[1px] border-grey-1 bg-grey-0 px-2 font-mont-md dark:border-grey-6 dark:bg-grey-5">
        <input
          type="text"
          placeholder={t('friends.search')}
          value={friendSearchQuery}
          onChange={e => {
            setFriendSearchQuery(e.target.value)
            handleSearchChange(e)
          }}
          className="clean-input h-8 w-full p-2 placeholder:text-grey-2 dark:text-grey-1"
        />
        <SearchIcon className="h-[25px] w-[25px] hover:cursor-pointer dark:text-grey-2" />
      </div>
      <div className="flex flex-wrap gap-2">
        {friendsToAdd.length > 0 &&
          friendsToAdd.map(friend => (
            <div
              key={friend.userId}
              className="flex h-6 items-center justify-center gap-1 rounded-full bg-grey-1 px-2 text-sm"
            >
              {friend.firstName}
              <button
                className="flex h-4 w-4 items-center justify-center rounded-full bg-grey-2"
                onClick={() => handleDeleteFriendToAdd(friend.userId)}
              >
                <CloseIcon className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
      </div>
      {friendSearchQuery.length > 0 && (
        <div
          className={`h-[${friends.length <= 4 ? friends.length * 50 : 200}] ${
            friends.length > 4 && 'scroll absolute overflow-y-scroll'
          }`}
        >
          {friends.length > 0 ? (
            <List className="w-full p-0 py-1 font-mont-md dark:bg-black">
              {friends.map(
                friend =>
                  !friendsToAdd.includes(friend) && (
                    <ListItemButton
                      key={friend.userId}
                      className="rounded-lg px-2 py-2 hover:bg-grey-0 dark:hover:bg-grey-5"
                      onClick={() => onFriendSelect(friend)}
                    >
                      <div className="flex w-full items-center gap-[5px] overflow-x-hidden text-sm">
                        <img
                          src={getImage(friend.photo, DefaultPhoto)}
                          alt="user photo"
                          className="h-8 w-8 rounded-full"
                        />
                        <h1 className="dark:text-white">{friend.firstName}</h1>
                        <h1 className="dark:text-white">{friend.lastName}</h1>
                      </div>
                    </ListItemButton>
                  )
              )}
            </List>
          ) : isLoadingFriends ? (
            <div className="flex flex-col items-center gap-2">
              <CircularProgress className="h-8 w-8 text-grey-2" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <h1 className="text-center text-sm italic text-grey-6 dark:text-grey-2">
                {t('general.no-results')}
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default FriendSelector
