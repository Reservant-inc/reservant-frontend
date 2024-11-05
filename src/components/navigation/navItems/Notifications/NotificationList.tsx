import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import { fetchGET } from "../../../../services/APIconn";
import FriendReq from "./FriendReq";
import { ListItemButton } from "@mui/material";

interface NotificationData {
  notificationId: number;
  dateCreated: string;
  dateRead: string | null;
  notificationType: string;
  details: any;
  photo: any;
}

interface FriendRequestData {
  dateSent: string;
  dateRead: string | null;
  otherUser: {
    userId: string;
    firstName: string;
    lastName: string;
    photo: any;
  };
}

interface NotificationListProps {
  updateUnreadCount: () => void;
  showAll: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  updateUnreadCount,
  showAll,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"notifications" | "friendRequests">(
    "notifications"
  );

  const unreadNotificationsCount = notifications.filter((n) => !n.dateRead).length;
  const unreadFriendRequestsCount = friendRequests.filter((fr) => !fr.dateRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetchGET("/notifications");
        const sortedNotifications = response.items.sort(
          (a: NotificationData, b: NotificationData) => {
            if (a.dateRead === null && b.dateRead !== null) return -1;
            if (a.dateRead !== null && b.dateRead === null) return 1;
            return (
              new Date(b.dateCreated).getTime() -
              new Date(a.dateCreated).getTime()
            );
          }
        );
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const response = await fetchGET("/friends/incoming");
        setFriendRequests(response.items);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchNotifications();
    fetchFriendRequests();
  }, []);

  const filteredNotifications = showAll
    ? notifications
    : notifications.filter((n) => !n.dateRead).slice(0, 3);

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="h-full w-full flex flex-col px-2">
      <div className="flex h-14 w-full items-center justify-between px-3 pt-4">
        <p className="font-mont-bd text-xl">Notifications</p>
      </div>

      {showAll && (
        <div className="flex justify-around">
          <ListItemButton
            onClick={() => setActiveTab("notifications")}
            className={`${
              activeTab === "notifications"
                ? "bg-white dark:bg-black text-primary"
                : "bg-grey-0 dark:bg-grey-5"
            } h-full w-full rounded-t-lg px-4 dark:text-grey-1 relative`}
          >
            Notifications
            {unreadNotificationsCount > 0 && (
              <span className="absolute right-3 top-1 h-4 w-4 rounded-full bg-primary dark:bg-secondary text-white text-xs flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </ListItemButton>
          <ListItemButton
            onClick={() => setActiveTab("friendRequests")}
            className={`${
              activeTab === "friendRequests"
                ? "bg-white dark:bg-black text-primary"
                : "bg-grey-0 dark:bg-grey-5"
            } h-full w-full rounded-t-lg px-4 dark:text-grey-1 relative`}
          >
            Friends
            {unreadFriendRequestsCount > 0 && (
              <span className="absolute right-3 top-1 h-4 w-4 rounded-full bg-primary dark:bg-secondary text-white text-xs flex items-center justify-center">
                {unreadFriendRequestsCount}
              </span>
            )}
          </ListItemButton>
        </div>
      )}

      <div className="flex-grow overflow-y-auto scroll">
        {activeTab === "notifications" && (
          <>
            {filteredNotifications.length === 0 ? (
              <div className="flex justify-center items-center py-1 italic">
                <p className="text-center text-grey-3">Brak nowych powiadomień</p>
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
                />
              ))
            )}
          </>
        )}

        {activeTab === "friendRequests" && (
          <>
            {friendRequests.length === 0 ? (
              <div className="flex justify-center items-center py-1 italic">
                <p className="text-center text-grey-3">
                  Brak zaproszeń do znajomych
                </p>
              </div>
            ) : (
              friendRequests.map((request) => (
                <FriendReq
                  key={request.otherUser.userId}
                  userId={request.otherUser.userId}
                  firstName={request.otherUser.firstName}
                  lastName={request.otherUser.lastName}
                  dateSent={request.dateSent}
                  photo={request.otherUser.photo}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
