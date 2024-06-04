import React, { useEffect, useState } from "react";
import OutsideClickHandler from "../../reusableComponents/OutsideClickHandler";
import { Notifications } from "@mui/icons-material";
import FriendRequest from "./FriendRequest";

interface NotificationsButtonProps {
  isDark: boolean;
}

const NotificationsButton: React.FC<NotificationsButtonProps> = ({
  isDark,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [menuHeight, setMenuHeight] = useState(200);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);

  const pressHandler = () => {
    setIsPressed(!isPressed);
  };

  function calcHeight(el: any) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  useEffect(() => {
    // const fetchFriendRequests = async () => {
    //   try {
    //     const data = await fetchGET('/friends/incoming');
    //     if (data.items && data.items.length > 0) {
    //       setFriendRequests(data.items);
    //       setHasNotifications(true);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching friend requests:", error);
    //   }
    // };

    // fetchFriendRequests();

    // dummy friend requesty
    const sampleRequests = [
      {
        senderId: "1",
        senderName: "John Doe",
        dateSent: "2024-06-03T23:06:18.329Z",
      },
      {
        senderId: "2",
        senderName: "Jane Smith",
        dateSent: "2024-06-01T10:20:30.123Z",
      },
    ];

    setFriendRequests(sampleRequests);
  }, []);

  const handleAction = (senderId: string) => {
    setFriendRequests((prevRequests) =>
      prevRequests.filter((req) => req.senderId !== senderId),
    );
    if (friendRequests.length === 1) {
      setHasNotifications(false);
    }
  };

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <button
        id="NotificationsButton"
        className="relative flex h-[95%] w-10 items-center justify-center"
        onClick={pressHandler}
      >
        <Notifications fontSize="large" />
        {hasNotifications && (
          <span className="absolute right-1 top-0 h-3 w-3 rounded-full bg-primary"></span>
        )}
      </button>
      {isPressed && (
        <div
          style={{ height: menuHeight }}
          className="dropdownMenu dark:bg-black"
        >
          <div className="w-full p-2">
            {friendRequests.map((request) => (
              <FriendRequest
                key={request.senderId}
                senderId={request.senderId}
                senderName={request.senderName}
                dateSent={request.dateSent}
                onAction={handleAction}
              />
            ))}
          </div>
        </div>
      )}
    </OutsideClickHandler>
  );
};

export default NotificationsButton;
