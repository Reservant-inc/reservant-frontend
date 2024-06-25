import React, { useEffect, useState } from "react";
import { fetchGET, fetchPOST, fetchDELETE } from "../../../services/APIconn";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Avatar,
  ListItemAvatar,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

interface NotificationListProps {
  setHasNotifications: (hasNotifications: boolean) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  setHasNotifications,
}) => {
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchGET("/friends/incoming");
      setFriendRequests(response.items);
      if (response.items.length === 0) {
        setHasNotifications(false);
      }
    } catch (error) {
      console.error("Error fetching incoming friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    senderId: string,
    action: "accept" | "reject",
  ) => {
    try {
      if (action === "accept") {
        await fetchPOST(
          `/friends/${senderId}/accept-request`,
          JSON.stringify({}),
        );
      } else {
        await fetchDELETE(`/friends/${senderId}`);
      }
      fetchFriendRequests();
      const friendsData = await fetchGET("/friends");
      console.log("Friends List:", friendsData);
    } catch (error) {
      console.error(
        `Error ${action === "accept" ? "accepting" : "rejecting"} friend request:`,
        error,
      );
    }
  };

  return (
    <div className="w-full p-2">
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {friendRequests.length === 0 ? (
            <Typography
              variant="subtitle1"
              color="textSecondary"
              align="center"
              style={{ fontStyle: "italic", padding: "20px 0" }}
            >
              Brak zaproszeń do znajomych
            </Typography>
          ) : (
            friendRequests.map((request) => (
              <ListItem
                key={request.senderId}
                button
                style={{ marginBottom: "16px" }}
              >
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <Grid container direction="column">
                  <Typography variant="subtitle2" color="textSecondary">
                    Zaproszenie do znajomych od
                  </Typography>
                  <ListItemText primary={request.senderName} />
                  <Typography variant="body2" color="textSecondary">
                    Wysłano {new Date(request.dateSent).toLocaleDateString()}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Button
                      variant="contained"
                      className="bg-primary"
                      onClick={() => handleAction(request.senderId, "accept")}
                    >
                      Akceptuj
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e0e0e0",
                        color: "#333",
                      }}
                      onClick={() => handleAction(request.senderId, "reject")}
                    >
                      Odrzuć
                    </Button>
                  </Box>
                </Grid>
              </ListItem>
            ))
          )}
        </List>
      )}
    </div>
  );
};

export default NotificationList;
