import React, { useEffect, useState } from 'react';
import { fetchGET, fetchDELETE, fetchPOST, getImage } from "../../services/APIconn";
import DefaultImage from "../../assets/images/user.jpg";
import Dialog from '../reusableComponents/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from "@mui/icons-material/Search";

interface Friend {
    dateSent: string;
    dateRead: string | null;
    dateAccepted: string | null;
    otherUser: {
        userId: string;
        firstName: string;
        lastName: string;
        photo: string;
    };
}

const FriendsManagement: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<Friend[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<Friend[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
    const [filteredOutgoingRequests, setFilteredOutgoingRequests] = useState<Friend[]>([]);
    const [filteredIncomingRequests, setFilteredIncomingRequests] = useState<Friend[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"friends" | "requests" | "incoming">("friends");

    const fetchFriendsData = async () => {
        setLoading(true);
        try {
            const friendsResponse = await fetchGET("/friends");
            const acceptedFriends = friendsResponse.items || [];
            const outgoingResponse = await fetchGET("/friends/outgoing");
            const outgoingRequests = outgoingResponse.items || [];
            const incomingResponse = await fetchGET("/friends/incoming");
            const incomingRequests = incomingResponse.items || [];

            setFriends(acceptedFriends);
            setOutgoingRequests(outgoingRequests);
            setIncomingRequests(incomingRequests);
            setFilteredFriends(acceptedFriends);
            setFilteredOutgoingRequests(outgoingRequests);
            setFilteredIncomingRequests(incomingRequests);
        } catch (error) {
            console.error("Error fetching friends data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendsData();
    }, []);

    const handleDeleteFriend = async () => {
        if (selectedFriend) {
            try {
                await fetchDELETE(`/friends/${selectedFriend.otherUser.userId}`);
                setDialogOpen(false);
                fetchFriendsData();
            } catch (error) {
                console.error("Error deleting friend:", error);
            }
        }
    };

    const handleCancelRequest = async (userId: string) => {
        try {
            await fetchDELETE(`/friends/${userId}`);
            fetchFriendsData();
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    };

    const handleAcceptRequest = async (userId: string) => {
        try {
            await fetchPOST(`/friends/${userId}/accept-request`);
            fetchFriendsData();
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const handleRejectRequest = async (userId: string) => {
        try {
            await fetchDELETE(`/friends/${userId}`);
            fetchFriendsData();
        } catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.length >= 3) {
            setFilteredFriends(
                friends.filter((friend) =>
                    (`${friend.otherUser.firstName} ${friend.otherUser.lastName}`).toLowerCase().includes(query)
                )
            );
            setFilteredOutgoingRequests(
                outgoingRequests.filter((request) =>
                    (`${request.otherUser.firstName} ${request.otherUser.lastName}`).toLowerCase().includes(query)
                )
            );
            setFilteredIncomingRequests(
                incomingRequests.filter((request) =>
                    (`${request.otherUser.firstName} ${request.otherUser.lastName}`).toLowerCase().includes(query)
                )
            );
        } else {
            setFilteredFriends(friends);
            setFilteredOutgoingRequests(outgoingRequests);
            setFilteredIncomingRequests(incomingRequests);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-[600px]">
            {/* Zakładki */}
            <div className="flex gap-1 bg-grey-1">
                <button
                    onClick={() => setActiveTab("friends")}
                    className={`${
                        activeTab === "friends"
                            ? "bg-white dark:bg-black text-primary rounded-t-lg"
                            : "bg-grey-0 dark:bg-grey-5 text-grey-2"
                    } px-4 py-2 text-center`}
                >
                    Znajomi
                </button>
                <button
                    onClick={() => setActiveTab("requests")}
                    className={`${
                        activeTab === "requests"
                            ? "bg-white dark:bg-black text-primary rounded-t-lg"
                            : "bg-grey-0 dark:bg-grey-5 text-grey-2"
                    } px-4 py-2 text-center`}
                >
                    Wysłane zaproszenia
                </button>
                <button
                    onClick={() => setActiveTab("incoming")}
                    className={`${
                        activeTab === "incoming"
                            ? "bg-white dark:bg-black text-primary rounded-t-lg"
                            : "bg-grey-0 dark:bg-grey-5 text-grey-2"
                    } px-4 py-2 text-center`}
                >
                    Przychodzące zaproszenia
                </button>
            </div>

            <div className="bg-white dark:bg-black rounded-lg rounded-tl-none shadow-md p-6 mt-0 gap-6">
                {/* Search Bar */}
                <div className="flex w-full items-center rounded-full border-[1px] border-grey-1 px-2 font-mont-md dark:border-grey-6 mb-4">
                    <input
                        type="text"
                        placeholder="Search friends"
                        className="w-full placeholder:text-grey-2"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
                </div>

                {/* Znajomi, Wysłane zaproszenia, albo przychodzące zaproszenia */}
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 min-h-[250px] justify-center">
                        {activeTab === "friends" ? (
                            // Znajomi
                            filteredFriends.length > 0 ? (
                                <ul className="flex flex-col gap-4">
                                    {filteredFriends.map((friend) => (
                                        <li key={friend.otherUser.userId} className="flex flex-col gap-2 bg-grey-1 p-2 rounded-lg min-h-[186px]">
                                            <div className="flex items-center gap-6">
                                                <img
                                                    src={getImage(friend.otherUser.photo, DefaultImage)}
                                                    alt={`${friend.otherUser.firstName} ${friend.otherUser.lastName}`}
                                                    className="w-24 h-24 rounded-full"
                                                />
                                                <div>
                                                    <span className="text-xl font-medium">
                                                        {friend.otherUser.firstName} {friend.otherUser.lastName}
                                                    </span>
                                                    {friend.dateAccepted && (
                                                        <p className="text-sm text-grey-2">
                                                            Dodano: {new Date(friend.dateAccepted).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-4 mt-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedFriend(friend);
                                                        setDialogOpen(true);
                                                    }}
                                                    className="border-[1px] text-sm p-2 rounded-lg bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
                                                >
                                                    Usuń znajomego
                                                </button>
                                                <button className="border-[1px] text-sm p-2 rounded-lg bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white">
                                                    Wyślij wiadomość
                                                    {/* TODO  */}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center italic text-grey-2">Brak pasujących znajomych</p>
                            )
                            // Wysłane zaproszenia
                        ) : activeTab === "requests" ? (
                            filteredOutgoingRequests.length > 0 ? (
                                <ul className="flex flex-col gap-4">
                                    {filteredOutgoingRequests.map((request) => (
                                        <li key={request.otherUser.userId} className="flex flex-col gap-2 bg-grey-1 p-2 rounded-lg min-h-[186px]">
                                            <div className="flex items-center gap-6">
                                                <img
                                                    src={getImage(request.otherUser.photo, DefaultImage)}
                                                    alt={`${request.otherUser.firstName} ${request.otherUser.lastName}`}
                                                    className="w-24 h-24 rounded-full"
                                                />
                                                <div>
                                                    <span className="text-xl font-medium">
                                                        {request.otherUser.firstName} {request.otherUser.lastName}
                                                    </span>
                                                    <p className="text-sm text-grey-2">
                                                        Wysłano: {new Date(request.dateSent).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCancelRequest(request.otherUser.userId)}
                                                className="mt-2 border-[1px] text-sm p-2 w-fit rounded-lg bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
                                            >
                                                Cofnij zaproszenie
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center italic text-grey-2">Brak wysłanych zaproszeń</p>
                            )
                        ) : (
                            // Przychodzące zaproszenia
                            filteredIncomingRequests.length > 0 ? (
                                <ul className="flex flex-col gap-4">
                                    {filteredIncomingRequests.map((request) => (
                                        <li key={request.otherUser.userId} className="flex flex-col gap-2 bg-grey-1 p-2 rounded-lg min-h-[186px]">
                                            <div className="flex items-center gap-6">
                                                <img
                                                    src={getImage(request.otherUser.photo, DefaultImage)}
                                                    alt={`${request.otherUser.firstName} ${request.otherUser.lastName}`}
                                                    className="w-24 h-24 rounded-full"
                                                />
                                                <div>
                                                    <span className="text-xl font-medium">
                                                        {request.otherUser.firstName} {request.otherUser.lastName}
                                                    </span>
                                                    <p className="text-sm text-grey-2">
                                                        Wysłano: {new Date(request.dateSent).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 mt-2">
                                                <button
                                                    onClick={() => handleAcceptRequest(request.otherUser.userId)}
                                                    className="border-[1px] text-sm p-2 rounded-lg bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
                                                >
                                                    Zaakceptuj
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(request.otherUser.userId)}
                                                    className="border-[1px] text-sm p-2 rounded-lg bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
                                                >
                                                    Odrzuć
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center italic text-grey-2">Brak przychodzących zaproszeń</p>
                            )
                        )}
                    </div>
                )}
            </div>

            {dialogOpen && selectedFriend && (
                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    title=""
                >
                    <div className="p-4">
                        <p className="text-lg">
                            Czy na pewno chcesz usunąć {selectedFriend.otherUser.firstName} {selectedFriend.otherUser.lastName} ze znajomych?
                        </p>
                        <div className="flex gap-4 mt-4 justify-end">
                            <button
                                onClick={handleDeleteFriend}
                                className="px-3 border-[1px] rounded-lg p-1 bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
                            >
                                Tak
                            </button>
                            <button
                                onClick={() => setDialogOpen(false)}
                                className="px-3 border-[1px] rounded-lg p-1 bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
                            >
                                Nie
                            </button>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default FriendsManagement;
