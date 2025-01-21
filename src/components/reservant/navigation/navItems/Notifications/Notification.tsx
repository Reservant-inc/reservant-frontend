import React, { useState } from 'react'
import { fetchGET, fetchPOST, getImage } from '../../../../../services/APIconn'
import { Rating } from '@mui/material'
import { formatDistanceToNow, format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import DefaultPhoto from '../../../../../assets/images/user.jpg'
import Cookies from 'js-cookie'
import { LoginResponseType } from '../../../../../services/types'
import { FetchError } from '../../../../../services/Errors'

interface NotificationProps {
  notificationId: number
  dateCreated: string
  dateRead: string | null
  notificationType: string
  details: any
  markAsRead: () => void
  photo: any
  user: any | null
  closeNotifications: any
}

const Notification: React.FC<NotificationProps> = ({
  notificationId,
  dateCreated,
  dateRead,
  notificationType,
  details,
  markAsRead,
  photo,
  user,
  closeNotifications
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [isRead, setIsRead] = useState(dateRead !== null)
  const navigate = useNavigate()

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

  const handleNavigation = async () => {
    if (!isRead) {
      try {
        await fetchPOST(
          '/notifications/mark-read',
          JSON.stringify({ notificationIds: [notificationId] })
        )
        setIsRead(true)
        markAsRead()
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }

    if (
      notificationType === 'NotificationFriendRequestAccepted' &&
      user.userId
    ) {
      navigate(`/reservant/profile/${user.userId}/friends/list`)
    } else if (
      notificationType === 'NotificationNewRestaurantReview' &&
      user &&
      details.restaurantId
    ) {
      navigate(
        `/reservant/${user.firstName}-${user.lastName}/management/restaurant/${details.restaurantId}/reviews-management`
      )
    } else if (
      notificationType === 'NotificationNewParticipationRequest' &&
      user.userId
    ) {
      navigate(`/reservant/profile/${user.userId}/event-history/created`)
    } else if (
      notificationType === 'NotificationParticipationRequestResponse' &&
      user.userId
    ) {
      navigate(`/reservant/profile/${user.userId}/event-history/participates`)
    } else if (
      notificationType === 'NotificationNewFriendRequest' &&
      user.userId
    ) {
      navigate(`/reservant/profile/${user.userId}/friends/incoming`)
    } else if (
      notificationType === 'NotificationRestaurantVerified' &&
      user.userId
    ) {
      const response: LoginResponseType = await fetchPOST('/auth/refresh-token')
      Cookies.set('token', response.token, { expires: 1 })

      try {
        const userInfo = await fetchGET('/user')

        Cookies.set(
          'userInfo',
          JSON.stringify({
            userId: userInfo.userId,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            roles: userInfo.roles,
            photo: userInfo.photo
          }),
          { expires: 1 }
        )
      } catch (error) {
        if (error instanceof FetchError) {
          console.log(error.formatErrors())
        } else {
          console.log('unexpected error')
        }
      }

      navigate(
        `/reservant/${user.firstName}-${user.lastName}/management/restaurant/${details.restaurantId}/restaurant-dashboard`
      )
    } else if (
      notificationType === 'NotificationVisitApprovedDeclined' &&
      user.userId
    ) {
      navigate(
        `/reservant/${user.firstName}-${user.lastName}/management/restaurant/${details.restaurantId}/restaurant-dashboard`
      )
    } else if (
      notificationType === 'NotificationReportAssigned' &&
      details.reportId
    ) {
      navigate(`/customer-service/reports/${details.reportId}`)
    }

    closeNotifications()
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
        return `Restauracja ${details.restaurantName} została zweryfikowana`
      case 'NotificationVisitApprovedDeclined':
        return `${details.restaurantName}: Wizyta ${details.isAccepted ? 'zaakceptowana' : 'odrzucona'}`
      case 'NotificationNewParticipationRequest':
        return `${details.eventName}: Nowa osoba zgłasza chęć uczestnictwa.`
      case 'NotificationParticipationRequestResponse':
        return `${details.name}: ${details.creatorName} ${details.isAccepted ? 'zaakceptował(a)' : 'odrzucił(a)'} Twoje uczestnictwo.`
      case 'NotificationNewMessage':
        return `Nowa wiadomość od ${details.authorName} w wątku ${details.threadTitle}.`
      case 'NotificationReportEscalated':
        return `Nowa skarga eskalowana.`
      case 'NotificationReportAssigned':
        return 'Zostałeś przypisany do nowej skargi.'
      case 'NotificationNewReservation':
        return `Nowa rezerwacja w ${details.restaurantName}.
${format(new Date(details.date), 'HH:mm', { locale: pl })} - ${format(new Date(details.endTime), 'HH:mm', { locale: pl })}
Liczba osób: ${details.numberOfPeople}`
      default:
        return 'Nowe powiadomienie.'
    }
  }

  const noExpandNotificationTypes = [
    'NotificationRestaurantVerified',
    'NotificationNewFriendRequest',
    'NotificationFriendRequestAccepted',
    'NotificationParticipationRequestResponse',
    'NotificationReportEscalated',
    'NotificationNewReservation',
    'NotificationReportAssigned'
  ]

  return (
    <div
      className={`rounded-md p-3 dark:bg-black cursor-pointer mb-1 dark:text-white ${
        isExpanded || isRead
          ? 'bg-grey-1 dark:bg-grey-5'
          : 'hover:bg-grey-1 dark:hover:bg-grey-5'
      }`}
      onClick={() => {
        handleNavigation()
        if (!noExpandNotificationTypes.includes(notificationType)) {
          toggleExpand()
        }
      }}
    >
      <div className="flex items-center space-x-2">
        {(notificationType === 'NotificationNewRestaurantReview' ||
          notificationType === 'NotificationRestaurantVerified' ||
          notificationType === 'NotificationVisitApprovedDeclined' ||
          notificationType === 'NotificationNewParticipationRequest' ||
          notificationType === 'NotificationReportEscalated' ||
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

      <div className="flex justify-end items-center mt-1">
        {isRead && <span className="text-xs ml-auto">Wyświetlono</span>}
      </div>
    </div>
  )
}

export default Notification
