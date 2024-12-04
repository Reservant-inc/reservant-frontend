//Tymczasowo dopóki back nie naprawi powiadomienia o new friend request
import React, { useState } from 'react'
import {
  fetchPOST,
  fetchDELETE,
  getImage
} from '../../../../../services/APIconn'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import DefaultPhoto from '../../../../../assets/images/user.jpg'

interface FriendReqProps {
  userId: string
  firstName: string
  lastName: string
  dateSent: string
  photo: any
}

const FriendReq: React.FC<FriendReqProps> = ({
  userId,
  firstName,
  lastName,
  dateSent,
  photo
}) => {
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleAccept = async () => {
    setLoading(true)
    try {
      await fetchPOST(`/friends/${userId}/accept-request`, {})
      setActionMessage('Zaakceptowano')
    } catch (error) {
      console.error('Error accepting friend request:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    setLoading(true)
    try {
      await fetchDELETE(`/friends/${userId}`)
      setActionMessage('Odrzucono')
    } catch (error) {
      console.error('Error rejecting friend request:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-md p-3 dark:bg-black bg-white mb-1 hover:bg-grey-1 dark:hover:bg-grey-5 dark:text-white">
      {/* Sekcja główna zaproszenia */}
      <div className="flex items-center space-x-2">
        <img
          src={photo ? getImage(photo, '') : DefaultPhoto}
          alt="User avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col">
          <p>{`${firstName} ${lastName}`}</p>
          <p className="text-xs">
            {format(new Date(dateSent), 'dd.MM.yyyy', { locale: pl })}
          </p>
        </div>
      </div>

      {/* Przyciski akceptacji/odrzucenia / komunikat */}
      {actionMessage ? (
        <p className="mt-2 text-grey-3">{actionMessage}</p>
      ) : (
        <div className="mt-2 flex justify-around">
          <button
            id={`${firstName}${lastName}NotificationAcceptFriendRequest`}
            onClick={handleAccept}
            disabled={loading}
            className="border-[1px] bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black dark:border-secondary dark:text-secondary dark:bg-grey-5 p-1 rounded transition hover:scale-105"
          >
            Zaakceptuj
          </button>
          <button
            id={`${firstName}${lastName}NotificationDeclineFriendRequest`}
            onClick={handleReject}
            disabled={loading}
            className="border-[1px] bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black dark:border-secondary dark:text-secondary dark:bg-grey-5 p-1 rounded transition hover:scale-105"
            
          >
            Odrzuć
          </button>
        </div>
      )}
    </div>
  )
}

export default FriendReq
