import React, { useState } from 'react';
import { fetchPOST, getImage } from '../../../../../services/APIconn';
import { formatDistanceToNow, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import DefaultPhoto from '../../../../../assets/images/user.jpg';
import { useTranslation } from 'react-i18next';

interface NotificationProps {
  notificationId: number;
  dateCreated: string;
  dateRead: string | null;
  notificationType: string;
  details: any;
  markAsRead: () => void;
  photo: any;
  user: any | null;
  closeNotifications: any;
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
  const [isRead, setIsRead] = useState(dateRead !== null);
  const navigate = useNavigate();
  const [t] = useTranslation('global');

  const handleNavigation = async () => {
    if (!isRead) {
      try {
        await fetchPOST(
          '/notifications/mark-read',
          JSON.stringify({ notificationIds: [notificationId] })
        );
        setIsRead(true);
        markAsRead();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  
    if (notificationType === 'NotificationFriendRequestAccepted' && user.userId) {
      navigate(`/reservant/profile/${user.userId}/friends/list`);
    } else if (
      notificationType === 'NotificationNewRestaurantReview' &&
      user &&
      details.restaurantId
    ) {
      navigate(
        `/reservant/${user.firstName}-${user.lastName}/management/restaurant/${details.restaurantId}/reviews-management`
      );
    } else if (
      (notificationType === 'NotificationNewParticipationRequest' && user.userId)
      
    ) {
      navigate(`/reservant/profile/${user.userId}/event-history/created`);
    } 
    else if (notificationType === 'NotificationParticipationRequestResponse' && user.userId) {
      navigate(`/reservant/profile/${user.userId}/event-history/participates`);
    }
    else if (notificationType === 'NotificationNewFriendRequest' && user.userId) {
      navigate(`/reservant/profile/${user.userId}/friends/incoming`);
    } else if (notificationType === 'NotificationRestaurantVerified' && user.userId) {
      navigate(
        `/reservant/${user.firstName}-${user.lastName}/management/restaurant/${details.restaurantId}/restaurant-dashboard`
      );
    } else if (notificationType === 'NotificationVisitApprovedDeclined' && user.userId) {
      navigate(
        `/reservant/profile/${user.userId}/reservation-history/incoming`
      );
    } else if (notificationType === 'NotificationReportAssigned' && details.reportId) {
      navigate(`/customer-service/reports/${details.reportId}`);
    }
  
    closeNotifications();
  };
  
  const formatDate = (dateString: string) => {
    const utcDate = new Date(dateString);
    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
  
    const now = new Date();
    const diffInDays = (now.getTime() - localDate.getTime()) / (1000 * 60 * 60 * 24);
  
    if (diffInDays < 1) {
      return localDate.toLocaleString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else if (diffInDays < 7) {
      return formatDistanceToNow(localDate, { addSuffix: true, locale: pl });
    } else {
      return localDate.toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

const renderNotificationText = () => {
  switch (notificationType) {
    case 'NotificationNewFriendRequest':
      return <span>{t('notifications.new-friend-request')}</span>;
    case 'NotificationFriendRequestAccepted':
      return (
        <span>
          <span className="font-mont-bd">{details.acceptingUserFullName}</span>{' '}
          {t('notifications.friend-request-accepted')}
        </span>
      );
    case 'NotificationNewRestaurantReview':
      return (
        <span>
          {t('notifications.new-restaurant-review')}{' '}
          <span className="font-mont-bd">{details.restaurantName}</span>
        </span>
      );
    case 'NotificationRestaurantVerified':
      return (
        <span>
          <span className="font-mont-bd">{details.restaurantName}</span>{' '}
          {t('notifications.restaurant-verified')}
        </span>
      );
    case 'NotificationVisitApprovedDeclined':
      return (
        <span>
          <span className="font-mont-bd">{details.restaurantName}</span>:{' '}
          {details.isAccepted
            ? t('notifications.visit-approved')
            : t('notifications.visit-declined')}
        </span>
      );
    case 'NotificationNewParticipationRequest':
      return (
        <span>
          {t('notifications.new-participation-request')}{' '}
          <span className="font-mont-bd">{details.eventName}</span>
        </span>
      );
    case 'NotificationParticipationRequestResponse':
      return (
        <span>
          <span className="font-mont-bd">{details.creatorName}</span>{' '}
          {details.isAccepted
            ? t('notifications.participation-accepted')
            : t('notifications.participation-declined')}{' '}
          <span className="font-mont-bd">{details.name}</span>.
        </span>
      );
    case 'NotificationNewMessage':
      return (
        <span>
          {t('notifications.new-message')} <span className="font-mont-bd">{details.threadTitle}</span>
        </span>
      );
    case 'NotificationReportEscalated':
      return <span>{t('notifications.report-escalated')}</span>;
    case 'NotificationReportAssigned':
      return <span>{t('notifications.report-assigned')}</span>;
    case 'NotificationNewReservation':
      return (
        <span>
          {t('notifications.new-reservation')} <span className="font-mont-bd">{details.restaurantName}</span>.{' '}
          {format(new Date(details.date), 'HH:mm', { locale: pl })} -{' '}
          {format(new Date(details.endTime), 'HH:mm', { locale: pl })}.{' '}
          {t('notifications.people')}: {details.numberOfPeople}.
        </span>
      );
    default:
      return <span>{t('notifications.new-notification')}</span>;
  }
};

return (
  <div
    className={`rounded-md p-3 dark:bg-black cursor-pointer mb-1 dark:text-white hover:bg-grey-1 dark:hover:bg-grey-5 ${isRead ? 'bg-grey-1 dark:bg-grey-5' : 'hover:bg-grey-1 hover:dark:bg-grey-5'}`}
    onClick={handleNavigation}
  >
    <div className="flex items-center space-x-2">
      {photo && (
        <img
          src={getImage(photo, '')}
          alt="logo"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className="flex flex-col font-mont-l text-sm">
        <p>{renderNotificationText()}</p>
      </div>
    </div>
    <div className="flex justify-between items-center mt-1">
      <span className="text-xs text-left">{formatDate(dateCreated)}</span>
      {isRead && <span className="text-xs">{t('notifications.read')}</span>}
    </div>
  </div>
);
};

export default Notification;
