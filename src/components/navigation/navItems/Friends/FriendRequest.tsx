import React from "react";
import { Avatar, Button } from "@mui/material";
import { fetchPOST, fetchDELETE } from "../../../../services/APIconn";
import { useTranslation } from "react-i18next";

interface FriendRequestProps {
  senderId: string;
  senderName: string;
  dateSent: string;
  onAction: (senderId: string) => void;
}

const FriendRequest: React.FC<FriendRequestProps> = ({
  senderId,
  senderName,
  dateSent, 
  onAction,
}) => {

  const { t } = useTranslation("global");
  
  const handleAccept = async () => {
    try {
      await fetchPOST(
        `/friends/${senderId}/accept-request`,
        JSON.stringify({}),
      );
      onAction(senderId);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleReject = async () => {
    try {
      await fetchDELETE(`/friends/${senderId}`);
      onAction(senderId);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const formattedDate = new Date(dateSent).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="border-grey-600 flex items-center border-b p-2">
      <Avatar className="mr-2" sx={{ width: 32, height: 32 }}>
        A
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold">{senderName}</div>
          <div className="text-gray-500 text-xs">{t("friends-sent")} {formattedDate}</div>
        </div>
        <div className="mt-1 flex gap-1">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAccept}
            style={{ backgroundColor: "#a94c79", color: "#fefefe" }}
          >
            {t("friends.accept")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleReject}
            style={{ backgroundColor: "#ff0000", color: "#fefefe" }}
          >
            {t("friends.reject")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
