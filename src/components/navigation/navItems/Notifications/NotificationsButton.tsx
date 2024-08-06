import React, { useEffect, useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import { Notifications } from "@mui/icons-material";
import NotificationList from "./NotificationList";
import { fetchGET } from "../../../../services/APIconn";

interface NotificationsButtonProps {
  isDark: boolean;
}

const NotificationsButton: React.FC<NotificationsButtonProps> = ({
  isDark,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
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
        className="relative flex h-[40px] w-[40px] items-center justify-center bg-grey-1 rounded-full"
        onClick={pressHandler}
      >
        <Notifications className="h-[30px] w-[30px]" />
        {hasNotifications && !loading && (
          <span className="absolute right-1 top-0 h-3 w-3 rounded-full bg-primary"></span>
        )}
      </button>
      {isPressed && (
        <div className="dropdownMenu dark:bg-black" style={{ width: "300px" }}>
          <NotificationList setHasNotifications={setHasNotifications} />
        </div>
      )}
    </OutsideClickHandler>
  );
};

export default NotificationsButton;
