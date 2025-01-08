import React, { useContext, useEffect, useState } from 'react';
import OutsideClickHandler from '../../../../reusableComponents/OutsideClickHandler';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import NotificationList from './NotificationList';
import { fetchGET } from '../../../../../services/APIconn';
import { Button } from '@mui/material';
import { ThemeContext } from '../../../../../contexts/ThemeContext';

const NotificationsButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);

  const { isDark } = useContext(ThemeContext);

  const pressHandler = () => {
    setIsPressed(!isPressed);
  };

  const fetchNotificationCount = async () => {
    setLoading(true);
    try {
      const response = await fetchGET('/notifications/bubbles');
      setUnreadNotificationCount(response.unreadNotificationCount);
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeNotifications = () => {
    setIsPressed(false);
  };

  const updateUnreadCount = async () => {
    await fetchNotificationCount();
  };

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <Button
        id="navbarNotificationsButton"
        className={`relative flex h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full bg-grey-1 dark:bg-grey-5 text-black dark:text-grey-1 ${
          isPressed && 'text-primary dark:text-secondary'
        }`}
        onClick={() => {
          pressHandler();
          setShowAll(false);
        }}
      >
        <NotificationsIcon className="h-[23px] w-[23px]" />
        {unreadNotificationCount > 0 && !loading && (
          <span className="absolute right-[-2px] top-0 h-4 w-4 rounded-full bg-primary dark:bg-secondary text-white text-xs flex items-center justify-center">
            {unreadNotificationCount}
          </span>
        )}
      </Button>
      {isPressed && (
        <div
          className={`nav-dropdown flex w-[300px] h-[45vh] flex-col z-[1] bg-white dark:bg-black`}
        >
          <div className="flex-1 w-full overflow-y-auto">
            <NotificationList
              updateUnreadCount={updateUnreadCount}
              showAll={showAll}
              closeNotifications={closeNotifications}
            />
          </div>
          <div className="w-full flex justify-end p-3">
            {showAll ? (
              <button
                id="showLatestNotificationsButton"
                onClick={() => setShowAll(false)}
                className="dark:bg-grey-5 dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black bg-white border-[1px] border-primary text-primary hover:text-white hover:bg-primary my-2 py-1 px-3 rounded transition hover:scale-105"
              >
                3 Najnowsze
              </button>
            ) : (
              <button
                id="showMoreNotificationsButton"
                onClick={() => setShowAll(true)}
                className="dark:bg-grey-5 dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black bg-white border-[1px] border-primary text-primary hover:text-white hover:bg-primary my-2 py-1 px-3 rounded transition hover:scale-105"
              >
                Wszystkie
              </button>
            )}
          </div>
        </div>
      )}
    </OutsideClickHandler>
  );
};

export default NotificationsButton;
