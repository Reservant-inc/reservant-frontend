import React, { useEffect, useState } from 'react';
import Notification from './Notification';
import { fetchGET } from '../../../../../services/APIconn';
import { CircularProgress } from '@mui/material';

interface NotificationData {
  notificationId: number;
  dateCreated: string;
  dateRead: string | null;
  notificationType: string;
  details: any;
  photo: any;
}

interface NotificationListProps {
  updateUnreadCount: () => void;
  showAll: boolean;
  closeNotifications: any;
}

const NotificationList: React.FC<NotificationListProps> = ({
  updateUnreadCount,
  showAll,
  closeNotifications,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userResponse = await fetchGET('/user');
        setUser(userResponse);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetchGET('/notifications');
        const sortedNotifications = response.items.sort(
          (a: NotificationData, b: NotificationData) => {
            if (a.dateRead === null && b.dateRead !== null) return -1;
            if (a.dateRead !== null && b.dateRead === null) return 1;
            return (
              new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
            );
          }
        );
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
    fetchNotifications();
  }, []);

  const filteredNotifications = showAll
    ? notifications
    : notifications.filter((n) => !n.dateRead).slice(0, 3);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-grey-3">
        <CircularProgress className="mb-4" />
        <p className="text-sm">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div
      className={`h-full w-full flex flex-col px-2 transition-all duration-500 ease-in-out ${
        showAll ? 'h-auto' : 'h-auto'
      }`}
    >
      <div className="flex h-14 w-full items-center justify-between px-3 pt-4">
        <p className="font-mont-bd text-xl dark:text-white">Notifications</p>
      </div>

      <div
        className={`flex-grow overflow-y-auto scroll transition-all duration-500 ease-in-out ${
          showAll ? 'h-auto' : 'h-auto'
        }`}
      >
        {filteredNotifications.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-center text-sm text-grey-3 italic">Brak nowych powiadomień</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Notification
              key={notification.notificationId}
              notificationId={notification.notificationId}
              dateCreated={notification.dateCreated}
              dateRead={notification.dateRead}
              notificationType={notification.notificationType}
              details={notification.details}
              photo={notification.photo}
              markAsRead={updateUnreadCount}
              user={user}
              closeNotifications={closeNotifications}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;
