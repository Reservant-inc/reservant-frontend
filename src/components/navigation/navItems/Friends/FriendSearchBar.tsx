import React, { useState, useEffect, useCallback } from "react";
import {
  List,
  Paper,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import { fetchGET, fetchPOST, fetchDELETE } from "../../../../services/APIconn";
import SendFriendRequest from "./SendFriendRequest";
import SearchIcon from '@mui/icons-material/Search';

interface FriendSearchBarProps {}

type UserType = {
  userId: string,
  firstName: string,
  lastName: string,
  photo: string
};

type FriendType = {
  dateSent: Date,
  dateRead: Date,
  dateAccepted: Date,
  otherUser: UserType
};

const FriendSearchBar: React.FC<FriendSearchBarProps> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]); //reqestType
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]); //reqestType
  const [friends, setFriends] = useState<any[]>([]);  //FriendType nie działa
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]); //reqestType
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    fetchUserData();
    fetchRequests();
    fetchFriends();
    fetchIncomingRequests();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetchGET("/user");
      setUserId(response.userId);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const outgoing = await fetchGET("/friends/outgoing");
      setOutgoingRequests(outgoing.items);
    } catch (error) {
      console.error("Error fetching outgoing requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetchGET("/friends");
      setFriends(response.items);
    } catch (error) {
      console.error("Error fetching friends list:", error);
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const response = await fetchGET("/friends/incoming");
      setIncomingRequests(response.items);
      
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length >= 3) {
      const results = mockFetchUsers(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // tego nie uzywam ale niech zostanie na razie, potem usune
  const mockUsers = [
    { id: 1, name: "Leanne Graham" },
    { id: 2, name: "Ervin Howell" },
    { id: 3, name: "Clementine Bauch" },
    { id: 4, name: "Patricia Lebsack" },
    { id: 5, name: "Chelsey Dietrich" },
    { id: 6, name: "Mrs. Dennis Schulist" },
    { id: 7, name: "Kurtis Weissnat" },
    { id: 8, name: "Nicholas Runolfsdottir V" },
    { id: 9, name: "Glenna Reichert" },
    { id: 10, name: "Clementina DuBuque" },
    { id: 11, name: "Leanne Graham1" },
    { id: 12, name: "Leanne Graham2" },
    { id: 13, name: "Leanne Graham3" },
    { id: 14, name: "Leanne Graham4" },
    { id: 15, name: "Leanne Graham5" },
    { id: 16, name: "Leanne Graham6" },
    { id: 17, name: "Leanne Graham7" },
  ];

  const mockFetchUsers = (query: string) => {
    return mockUsers
      .filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  };

  const handleInvite = useCallback(async (userId: string) => {
    try {
      await fetchPOST(
        `/friends/${userId}/send-request`,
        JSON.stringify({ userId }),
      );
      fetchRequests();
      fetchFriends();
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  }, []);

  const handleCancelInvite = useCallback(async (userId: string) => {
    try {
      await fetchDELETE(`/friends/${userId}`);
      fetchRequests();
      fetchFriends();
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  }, []);

  const handleRemoveFriend = useCallback(async (userId: string) => {
    try {
      await fetchDELETE(`/friends/${userId}`);
      fetchFriends();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  }, []);

  const isRequestSent = (userId: string) => {
    return outgoingRequests.find((request) => request.receiverId === userId);
  };

  const isRequestReceived = (userId: string) => {
    return incomingRequests.find((request) => request.senderId === userId);
  };

  const isFriend = (userId: string) => {
    return friends.find(
      (friend) => friend.senderId === userId || friend.receiverId === userId,
    );
  };

  return (
    <div className="relative">
      <div className="w-full flex px-2 rounded-full h-10 items-center bg-grey-0 border-[1px] border-grey-1 font-mont-md">
        <input
          type="text"
          placeholder="Szukaj znajomych"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          className="w-60 p-2 clean-input h-8"
          />
        <SearchIcon className="hover:cursor-pointer h-[25px] w-[25px]"/>
      </div>
      {isFocused && (
        <Paper className="absolute left-0 z-10 mt-1 w-full">
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
              {[
                {
                  senderId: "e5779baf-5c9b-4638-b9e7-ec285e57b367",
                  senderName: "JD",
                },
                {
                  senderId: "22781e02-d83a-44ef-8cf4-735e95d9a0b2",
                  senderName: "JD+hall",
                },
                {
                  senderId: "06c12721-e59e-402f-aafb-2b43a4dd23f2",
                  senderName: "JD+backdoors",
                },
                {
                  senderId: "f1b1b494-85f2-4dc7-856d-d04d1ce50d65",
                  senderName: "JD+employee",
                },
                {
                  senderId: "558614c5-ba9f-4c1a-ba1c-07b2b67c37e9",
                  senderName: "KK",
                },
                {
                  senderId: "e08ff043-f8d2-45d2-b89c-aec4eb6a1f29",
                  senderName: "customer",
                },
                {
                  senderId: "86a24e58-cb06-4db0-a346-f75125722edd",
                  senderName: "customer2",
                },
                {
                  senderId: "a79631a0-a3bf-43fa-8fbe-46e5ee697eeb",
                  senderName: "customer3",
                },
              ]
                .filter((user) => user.senderId !== userId)
                .map((user) => (
                  <SendFriendRequest
                    key={user.senderId}
                    user={user}
                    request={isRequestSent(user.senderId)}
                    isFriend={isFriend(user.senderId)}
                    isRequestReceived={isRequestReceived(user.senderId)}
                    handleInvite={handleInvite}
                    handleCancelInvite={handleCancelInvite}
                    handleRemoveFriend={handleRemoveFriend}
                  />
                ))}
              {searchTerm.length >= 3 && (
                <>
                  {searchResults.length > 0 ? (
                    searchResults
                      .filter((user) => user.id !== userId)
                      .map((user) => (
                        <SendFriendRequest
                          key={user.id}
                          user={{ senderId: user.id, senderName: user.name }}
                          request={isRequestSent(user.id)}
                          isFriend={isFriend(user.id)}
                          isRequestReceived={isRequestReceived(user.id)}
                          handleInvite={handleInvite}
                          handleCancelInvite={handleCancelInvite}
                          handleRemoveFriend={handleRemoveFriend}
                        />
                      ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="Brak pasujących użytkowników" />
                    </ListItem>
                  )}
                  {searchResults.length > 0 && (
                    <ListItem button>
                      <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        style={{ color: "#a94c79" }}
                      >
                        Wyświetl wszystkich
                      </Button>
                    </ListItem>
                  )}
                </>
              )}
            </List>
          )}
        </Paper>
      )}
    </div>
  );
};

export default FriendSearchBar;
