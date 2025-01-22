import React, { useState } from 'react'
import { UserSearchType } from '../../../../../services/types'
import {
  fetchDELETE,
  fetchPOST,
  getImage
} from '../../../../../services/APIconn'
import { FriendStatus } from '../../../../../services/enums'
import CheckSharpIcon from '@mui/icons-material/CheckSharp'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import UndoSharpIcon from '@mui/icons-material/UndoSharp'
import SendSharpIcon from '@mui/icons-material/SendSharp'
import { FetchError } from '../../../../../services/Errors'
import DefaultPhoto from '../../../../../assets/images/user.jpg'
import { useTranslation } from 'react-i18next'

interface SearchedFriendProps {
  user: UserSearchType
}

const SearchedFriend: React.FC<SearchedFriendProps> = ({ user }) => {
  const [refresh, forceRefresh] = useState<boolean>(true)

  const [t] = useTranslation('global')

  const sendRequest = () => {
    try {
      fetchPOST(`/friends/${user.userId}/send-request`)
      user.friendStatus = FriendStatus.OutgoingRequest
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.message)
      } else {
        console.error('There was trouble sending friend request', error)
      }
    } finally {
      forceRefresh(!refresh)
    }
  }

  const acceptRequest = () => {
    try {
      fetchPOST(`/friends/${user.userId}/accept-request`)
      user.friendStatus = FriendStatus.Friend
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.message)
      } else {
        console.error('There was trouble accepting friend request', error)
      }
    } finally {
      forceRefresh(!refresh)
    }
  }

  const deleteRequest = () => {
    try {
      fetchDELETE(`/friends/${user.userId}`)
      user.friendStatus = FriendStatus.Stranger
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.message)
      } else {
        console.error('There was trouble deleting friend request', error)
      }
    } finally {
      forceRefresh(!refresh)
    }
  }

  return (
    <div className="flex w-full justify-between">
      <div className="flex w-[60%] items-center gap-[5px] overflow-x-hidden text-sm">
        <img
          src={getImage(user.photo, DefaultPhoto)}
          alt="user photo"
          className="h-8 w-8 rounded-full"
        />
        <h1 className="dark:text-white">{user.firstName}</h1>
        <h1 className="dark:text-white">{user.lastName}</h1>
      </div>
      <div className="flex w-[25%] items-center justify-center">
        {
          {
            [FriendStatus.Friend]: (
              <h1 className="flex h-12 items-center gap-1 text-sm text-grey-2">
                {t('friends.friends')} <CheckSharpIcon className="h-5 w-5" />
              </h1>
            ),
            [FriendStatus.OutgoingRequest]: (
              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md p-2 text-sm text-grey-2 hover:text-secondary"
                onClick={deleteRequest}
              >
                {t('friends.undo')}
                <UndoSharpIcon className="h-5 w-5" />
              </button>
            ),
            [FriendStatus.IncomingRequest]: (
              <div className="flex h-12 w-full items-center justify-around">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-md p-1 text-sm text-grey-2 hover:text-red"
                  onClick={deleteRequest}
                >
                  <CloseSharpIcon className="h-5 w-5" />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-md p-1 text-sm text-grey-2 hover:text-green"
                  onClick={acceptRequest}
                >
                  <CheckSharpIcon className="h-5 w-5" />
                </button>
              </div>
            ),
            [FriendStatus.Stranger]: (
              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md p-2 text-sm text-grey-2 hover:text-primary"
                onClick={sendRequest}
              >
                {t('friends.send')} <SendSharpIcon className="h-5 w-5" />
              </button>
            )
          }[user.friendStatus]
        }
      </div>
    </div>
  )
}

export default SearchedFriend
