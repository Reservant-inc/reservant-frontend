import React, { useState } from 'react'
import { fetchPOST, getImage } from '../../../../../services/APIconn'
import { Rating } from '@mui/material'
import { formatDistanceToNow, format } from 'date-fns'
import { pl } from 'date-fns/locale'
import DefaultPhoto from '../../../../../assets/images/user.jpg'

interface NotificationProps {
  notificationId: number
  dateCreated: string
  dateRead: string | null
  notificationType: string
  details: any
  markAsRead: () => void
  photo: any
}

const Notification: React.FC<NotificationProps> = ({
  notificationId,
  dateCreated,
  dateRead,
  notificationType,
  details,
  markAsRead,
  photo
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [isRead, setIsRead] = useState(dateRead !== null)

  const toggleExpand = async () => {
    setIsExpanded(!isExpanded)

    if (!isRead) {
      try {
        await fetchPOST(
          '/notifications/mark-read',
          JSON.stringify({ notificationIds: [notificationId] })
        )
        setIsRead(true)
        markAsRead()
      } catch (error: any) {
        console.error('Error marking notification as read:', error)
      }
    }
  }

  const handleAcceptParticipation = async () => {
    setLoading(true)
    try {
      await fetchPOST(
        `/events/${details.eventId}/accept-user/${details.senderId}`,
        {}
      )
      setActionMessage('Zaakceptowano')
    } catch (error) {
      console.error('Error accepting participation request:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectParticipation = async () => {
    setLoading(true)
    try {
      await fetchPOST(
        `/events/${details.eventId}/reject-user/${details.senderId}`,
        {}
      )
      setActionMessage('Odrzucono')
    } catch (error) {
      console.error('Error rejecting participation request:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

    if (diffInDays < 1) {
      return format(date, 'HH:mm', { locale: pl })
    } else if (diffInDays < 7) {
      return formatDistanceToNow(date, { addSuffix: true, locale: pl })
    } else {
      return format(date, 'dd.MM.yyyy', { locale: pl })
    }
  }

  const renderNotificationText = () => {
    switch (notificationType) {
      case 'NotificationNewFriendRequest':
        return 'Wysłano zaproszenie.'
      case 'NotificationFriendRequestAccepted':
        return `${details.acceptingUserFullName} zaakceptował(a) Twoje zaproszenie do znajomych.`
      case 'NotificationNewRestaurantReview':
        return `${details.restaurantName}: Nowa opinia`
      case 'NotificationRestaurantVerified':
        return `${details.restaurantName}: Zweryfikowana`
      case 'NotificationVisitApprovedDeclined':
        return `${details.restaurantName}: Wizyta ${details.isAccepted ? 'zaakceptowana' : 'odrzucona'}`
      case 'NotificationNewParticipationRequest':
        return `${details.eventName}: Nowa osoba zgłasza chęć uczestnictwa.`
      case 'NotificationParticipationRequestResponse':
        return `${details.name}: ${details.creatorName} ${details.isAccepted ? 'zaakceptował(a)' : 'odrzucił(a)'} Twoje uczestnictwo.`
      default:
        return 'Nowe powiadomienie.'
    }
  }

  const noExpandNotificationTypes = [
    'NotificationRestaurantVerified',
    'NotificationNewFriendRequest',
    'NotificationFriendRequestAccepted',
    'NotificationParticipationRequestResponse'
  ]

  return (
    <div
      className={`rounded-md p-3 dark:bg-black cursor-pointer mb-1 dark:text-white ${
        isExpanded || isRead
          ? 'bg-grey-1 dark:bg-grey-5'
          : 'hover:bg-grey-1 dark:hover:bg-grey-5'
      }`}
      onClick={() => {
        if (!noExpandNotificationTypes.includes(notificationType)) {
          toggleExpand()
        } else {
          toggleExpand()
        }
      }}
    >
      {/* Główna sekcja powiadomienia */}
      <div className="flex items-center space-x-2">
        {(notificationType === 'NotificationNewRestaurantReview' ||
          notificationType === 'NotificationRestaurantVerified' ||
          notificationType === 'NotificationVisitApprovedDeclined' ||
          notificationType === 'NotificationNewParticipationRequest' ||
          notificationType === 'NotificationParticipationRequestResponse') && (
          <img
            src={photo ? getImage(photo, '') : DefaultPhoto}
            alt="logo"
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex flex-col font-mont-l text-sm">
          <p>{renderNotificationText()}</p>
          <p className="text-xs">{formatDate(dateCreated)}</p>
        </div>
      </div>

      {!noExpandNotificationTypes.includes(notificationType) && (
        <div
          className="font-mont-l text-sm"
          style={{
            maxHeight: isExpanded ? '300px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease, opacity 0.4s ease',
            opacity: isExpanded ? 1 : 0
          }}
        >
          {isExpanded &&
            notificationType === 'NotificationNewParticipationRequest' && (
              <div className="mt-2">
                <p>{`${details.senderName} chce uczestniczyć w Twoim evencie ${details.eventName}.`}</p>
                {actionMessage ? (
                  <p className="mt-2">{actionMessage}</p>
                ) : (
                  <div className="mt-2 flex justify-between">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleAcceptParticipation()
                      }}
                      disabled={loading}
                      className="bg-primary hover:bg-primary-2 text-white p-1 rounded"
                    >
                      Zaakceptuj
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleRejectParticipation()
                      }}
                      disabled={loading}
                      className="bg-primary-2 hover:bg-primary-3 text-white p-1 rounded"
                    >
                      Odrzuć
                    </button>
                  </div>
                )}
              </div>
            )}

          {isExpanded &&
            notificationType === 'NotificationNewRestaurantReview' && (
              <div className="mt-2">
                <p>Autor: {details.authorName}</p>
                <div className="flex items-center">
                  <Rating name="read-only" value={details.stars} readOnly />
                </div>
                <p className="mt-2">{details.contents}</p>
              </div>
            )}

          {isExpanded &&
            notificationType === 'NotificationVisitApprovedDeclined' && (
              <div className="mt-2">
                <p>
                  Data wizyty:{' '}
                  {format(new Date(details.date), 'dd.MM.yyyy HH:mm', {
                    locale: pl
                  })}
                </p>
              </div>
            )}
        </div>
      )}

      {/* Strzałka i wyświetlono na dole */}
      <div className="flex justify-end items-center mt-1">
        {!noExpandNotificationTypes.includes(notificationType) && (
          <span>{isExpanded ? '^' : 'v'}</span>
        )}
        {isRead && <span className="text-xs ml-auto">Wyświetlono</span>}
      </div>
    </div>
  )
}

export default Notification
