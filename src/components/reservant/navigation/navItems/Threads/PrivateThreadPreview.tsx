import React, { useState } from 'react'
import { FriendData, ThreadType } from '../../../../../services/types'
import { useTranslation } from 'react-i18next'
import { fetchPOST, fetchGET, getImage } from '../../../../../services/APIconn'
import { FetchError } from '../../../../../services/Errors'
import DefaultImage from '../../../../../assets/images/user.jpg'

interface ThreadPreviewProps {
  friend: FriendData
  handleThreadOpen: Function
  pressHandler: Function
  getFriends: Function
}

const PrivateThreadPreview: React.FC<ThreadPreviewProps> = ({
  friend,
  handleThreadOpen,
  pressHandler,
  getFriends
}) => {
  const [t] = useTranslation('global')

  const createThread = async (id: string) => {
    const response = await fetchPOST(
      '/threads/create-private-thread',
      JSON.stringify({ otherUserId: id })
    )

    return response
  }

  const handlePrivateThreadClick = async () => {
    const otherUser = friend.otherUser

    let response

    try {
      if (friend.privateMessageThreadId === 0) {
        response = await createThread(otherUser.userId)
        getFriends()
      } else {
        response = await fetchGET(`/threads/${friend.privateMessageThreadId}`)
      }
    } catch (error) {
      if (error instanceof FetchError) {
        if (error.errors.includes('NotFound')) {
          response = await createThread(otherUser.userId)
        } else {
          console.error(error.formatErrors())
        }
      } else {
        console.error('Unexpected error while creating thread', error)
      }
    }

    handleThreadOpen({
      ...response,
      title: `${otherUser.firstName} ${otherUser.lastName}`
    })
  }

  return (
    <div className="flex items-center justify-between gap-2 w-full hover:bg-grey-0 dark:hover:bg-grey-5 relative">
      {friend && (
        <>
          <button
            key={friend.otherUser.userId}
            className="w-full rounded-md p-2 dark:hover:bg-grey-5 text-left"
            onClick={() => {
              handlePrivateThreadClick()
              pressHandler()
            }}
          >
            <div className="flex gap-3 items-center">
              <img
                src={getImage(friend.otherUser.photo, DefaultImage)}
                className="h-9 w-9 rounded-full"
              />
              <h1 className="text-sm dark:text-white">{`${friend.otherUser.firstName} ${friend.otherUser.lastName}`}</h1>
            </div>
          </button>
        </>
      )}
    </div>
  )
}

export default PrivateThreadPreview
