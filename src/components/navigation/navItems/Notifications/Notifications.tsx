import React, { useEffect, useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import NotificationList from "./NotificationList";
import { fetchGET } from "../../../../services/APIconn";
import { Button } from "@mui/material";

interface NotificationsButtonProps {
  isDark: boolean;
}

const NotificationsButton: React.FC<NotificationsButtonProps> = ({
  isDark,
}) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const pressHandler = () => {
    setIsPressed(!isPressed);
  };

  const fetchNotificationCount = async () => {
    setLoading(true);
    try {
      const response = await fetchGET("/notifications/bubbles");
      setUnreadNotificationCount(response.unreadNotificationCount);
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
    } finally {
      setLoading(false);
    }
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
        id="NotificationsButton"
        className={`relative flex h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full bg-grey-1 dark:bg-grey-5 text-black dark:text-grey-1 ${isPressed && "text-primary dark:text-secondary"}`}
        onClick={pressHandler}
      >
        <NotificationsIcon className="h-[23px] w-[23px]" />
        {/* Wyświetl span tylko jeśli są nieprzeczytane powiadomienia */}
        {unreadNotificationCount > 0 && !loading && (
          <span className="absolute right-[-2px] top-0 h-4 w-4 rounded-full bg-primary dark:bg-secondary text-white text-xs flex items-center justify-center">
            {unreadNotificationCount}
          </span>
        )}
      </Button>
      {isPressed && (
        <div className="nav-dropdown flex h-[calc(100%-4.5rem)] w-[300px] flex-col items-center z-[1] bg-white dark:bg-black">
          <NotificationList updateUnreadCount={updateUnreadCount} />
        </div>
      )}
    </OutsideClickHandler>
  );
};

export default NotificationsButton;
