import React, { useEffect, useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import NotificationList from "./NotificationList";
import { fetchGET } from "../../../../services/APIconn";

interface NotificationsButtonProps {
  isDark: boolean;
}

const NotificationsButton: React.FC<NotificationsButtonProps> = ({
  isDark,
}) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [hasNotifications, setHasNotifications] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const pressHandler = () => {
    setIsPressed(!isPressed);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetchGET("/friends/incoming");
      setHasNotifications(response.items.length > 0);
    } catch (error) {
      console.error("Error fetching incoming friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <button
        id="NotificationsButton"
        className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full bg-grey-1 dark:bg-grey-5 dark:text-grey-1"
        onClick={pressHandler}
      >
        <NotificationsIcon className="h-[30px] w-[30px]" />
        {hasNotifications && !loading && (
          <span className="absolute right-1 top-0 h-3 w-3 rounded-full bg-primary dark:bg-secondary"></span>
        )}
      </button>
      {isPressed && (
        <div className="nav-dropdown h-[150px] w-[300px] dark:bg-black">
          <NotificationList setHasNotifications={setHasNotifications} />
        </div>
      )}
    </OutsideClickHandler>
  );
};

export default NotificationsButton;
