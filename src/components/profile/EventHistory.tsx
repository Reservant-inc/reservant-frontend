// TODO: Końcówka do usuwania uczestnika z mojego eventu - nie ma
// Jak pogodzić akceptowanie / odrzucanie zainteresowanego + unieważnienie powiadomienia o tym
// Ewentualnie usunąć z powiadomienia opcję akceptacji/odrzucenia. A zamiast tego np. przenieść do zarządzania uczestnikami 
// Przerobić Dialog po utworzeniu eventu żeby był po prostu potwierdzeniem utworzenia
// Dla eventów z przeszłości inne funkcje niż dla tych z przyszłości
// Sortowanie ? Albo automatycznie od najnowszych eventów 

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ListItemButton, CircularProgress } from "@mui/material";
import { fetchGET, fetchDELETE, fetchPOST, getImage } from "../../services/APIconn";
import Dialog from "../reusableComponents/Dialog";
import SearchIcon from "@mui/icons-material/Search";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import DeleteIcon from "@mui/icons-material/Delete";

interface EventData {
  eventId: number;
  name: string;
  description: string;
  time: string;
  maxPeople: number;
  mustJoinUntil: string;
  creator: {
    userId: string;
    firstName: string;
    lastName: string;
    photo: string | null;
  };
  participants: Array<{
    userId: string;
    firstName: string;
    lastName: string;
    photo: string;
  }>;
  restaurant: {
    restaurantId: number;
    name: string;
    address: string;
    city: string;
    logo: string;
    rating: number;
    numberReviews: number;
  };
  numberInterested: number;
  photo: string | null;
}

interface InterestedUser {
  userId: string;
  firstName: string;
  lastName: string;
  photo: string;
}

const EventHistory: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [activeTab, setActiveTab] = useState<"created" | "interested">("created");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null);
  const [showManageParticipantsDialog, setShowManageParticipantsDialog] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([]);
  const [eventDetails, setEventDetails] = useState<EventData | null>(null);
  const userId = JSON.parse(Cookies.get("userInfo") as string).userId;

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await fetchGET("/user/events");
        setEvents(response.items || []);
        setFilteredEvents(response.items || []);
      } catch (error) {
        console.error("Error fetching user events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  const fetchInterestedUsers = async (eventId: number) => {
    try {
      const response = await fetchGET(`/events/${eventId}/interested`);
      setInterestedUsers(response.items || []);
    } catch (error) {
      console.error("Error fetching interested users:", error);
    }
  };

  const fetchEventDetails = async (eventId: number) => {
    setLoadingParticipants(true);
    try {
      const response = await fetchGET(`/events/${eventId}`);
      setEventDetails(response);
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleRejectUser = async (eventId: number, userId: string) => {
    try {
      await fetchPOST(`/events/${eventId}/reject-user/${userId}`);
      fetchInterestedUsers(eventId);
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const handleAcceptUser = async (eventId: number, userId: string) => {
    try {
      await fetchPOST(`/events/${eventId}/accept-user/${userId}`);
      fetchInterestedUsers(eventId);
      fetchEventDetails(eventId);
    } catch (error) {
      console.error("Error accepting user:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      const endpoint =
        activeTab === "created"
          ? `/events/${eventToDelete.eventId}`
          : `/events/${eventToDelete.eventId}/interested`;
      try {
        await fetchDELETE(endpoint);
        setEvents(events.filter((event) => event.eventId !== eventToDelete.eventId));
        setFilteredEvents(filteredEvents.filter((event) => event.eventId !== eventToDelete.eventId));
        setShowDeleteDialog(false);
        setEventToDelete(null);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    if (query.length >= 3) {
      setFilteredEvents(events.filter((event) => event.name.toLowerCase().includes(query)));
    } else {
      setFilteredEvents(events);
    }
  };

  // Jeśli userId == userId twórcy eventu to do created. Jeśli nie to do interested
  const filteredTabEvents = filteredEvents.filter((event) =>
    activeTab === "created" ? event.creator.userId === userId : event.creator.userId !== userId
  );

  const handleManageParticipants = (event: EventData) => {
    fetchInterestedUsers(event.eventId);
    fetchEventDetails(event.eventId);
    setShowManageParticipantsDialog(true);
  };

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Circular Progress do ładowania */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress className="text-grey-0" />
        </div>
      ) : (
        <>
        {/* zmiana zakładki aktywnej */}
          <div className="flex justify-around mb-4">
            <ListItemButton
              onClick={() => setActiveTab("created")}
              className={`${
                activeTab === "created"
                  ? "bg-white dark:bg-black text-primary"
                  : "bg-grey-0 dark:bg-grey-5"
              } w-full rounded-t-lg px-4 dark:text-grey-1`}
            >
              Utworzone
            </ListItemButton>
            <ListItemButton
              onClick={() => setActiveTab("interested")}
              className={`${
                activeTab === "interested"
                  ? "bg-white dark:bg-black text-primary"
                  : "bg-grey-0 dark:bg-grey-5"
              } w-full rounded-t-lg px-4 dark:text-grey-1`}
            >
              Zainteresowane
            </ListItemButton>
          </div>

          {/* input do filtrowania, działa od 3 znaków */}
          <div className="flex w-full items-center rounded-full border-[1px] border-grey-1 bg-grey-0 px-1 font-mont-md dark:border-grey-6 dark:bg-grey-5 mb-4">
            <input
              type="text"
              placeholder="Search events"
              className="w-full placeholder:text-grey-2"
              onChange={handleSearchChange}
            />
            <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
          </div>

          {/* wydarzenia */}
          <div className="flex flex-col gap-4 px-2 overflow-y-auto scroll max-h-60vh">
            {filteredTabEvents.length === 0 ? (
              <p className="italic text-center">
                {activeTab === "created" ? "Brak utworzonych wydarzeń." : "Brak zainteresowanych wydarzeń."}
              </p>
            ) : (
              filteredTabEvents.map((event) => (
                <div
                  key={event.eventId}
                  className="p-4 rounded-lg bg-grey-1 dark:text-grey-1 dark:bg-grey-2"
                >
                  {event.photo && (
                    <img
                      src={getImage(event.photo, "")}
                      alt={`${event.name} event`}
                      className="w-full h-auto rounded-t-lg object-cover mb-2"
                      style={{ maxHeight: "200px" }}
                    />
                  )}
                  <h2 className="font-bold text-xl">{event.name}</h2>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-sm">
                    <strong>Data wydarzenia:</strong> {new Date(event.time).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <strong>Restauracja:</strong> {event.restaurant.name}, {event.restaurant.city}
                  </p>
                  <p className="text-sm">
                    <strong>Liczba zainteresowanych:</strong> {event.numberInterested}
                  </p>

                  {activeTab === "created" ? (
                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                        onClick={() => console.log("Edytuj")}
                      >
                        Edytuj
                      </button>
                      <button
                        className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                        onClick={() => {
                          setShowDeleteDialog(true);
                          setEventToDelete(event);
                        }}
                      >
                        Usuń
                      </button>
                      <button
                        className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                        onClick={() => handleManageParticipants(event)}
                      >
                        Zarządzaj uczestnikami
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setEventToDelete(event);
                      }}
                    >
                      Usuń zainteresowanie
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* dialog do potwierdzenia usuwania */}
          {showDeleteDialog && eventToDelete && (
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} title="Potwierdzenie usunięcia">
              <div className="p-4">
                <p className="mb-4">
                  Czy na pewno chcesz {activeTab === "created" ? "usunąć wydarzenie" : "usunąć zainteresowanie"}{" "}
                  {eventToDelete.name}?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                    onClick={handleDeleteEvent}
                  >
                    Tak
                  </button>
                  <button
                    className="bg-primary-2 hover:bg-primary-3 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Nie
                  </button>
                </div>
              </div>
            </Dialog>
          )}

          {showManageParticipantsDialog && (
            <Dialog
              open={showManageParticipantsDialog}
              onClose={() => setShowManageParticipantsDialog(false)}
              title="Zarządzaj uczestnikami"
            >
              <div className="flex p-4 w-[600px] h-[190px] overflow-y-auto scroll">
                {loadingParticipants ? (
                  <CircularProgress className="m-auto text-grey-0" />
                ) : (
                  <>
                    <div className="w-1/2 p-2">
                      <h2 className="font-semibold text-lg mb-3">Uczestnicy</h2>
                      {eventDetails && eventDetails.participants.length === 0 ? (
                        <p className="italic text-center">Brak uczestników</p>
                      ) : (
                        eventDetails?.participants.map((participant) => (
                          <div key={participant.userId} className="flex items-center mb-3 gap-4">
                            <img
                              src={getImage(participant.photo, "")}
                              alt={`${participant.firstName} ${participant.lastName}`}
                              className="h-10 w-10 rounded-full"
                            />
                            <span>{participant.firstName} {participant.lastName}</span>
                            <div className="flex ml-auto gap-1">
                              <DeleteIcon className="cursor-pointer hover:text-red-500" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="w-1/2 p-2">
                      <h2 className="font-semibold text-lg mb-3">Zainteresowani</h2>
                      {interestedUsers.length === 0 ? (
                        <p className="italic text-center">Brak zainteresowanych osób</p>
                      ) : (
                        interestedUsers.map((user) => (
                          <div key={user.userId} className="flex items-center mb-3 gap-4">
                            <img
                              src={getImage(user.photo, "")}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="h-10 w-10 rounded-full"
                            />
                            <span>{user.firstName} {user.lastName}</span>
                            <div className="flex ml-auto gap-1">
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-md p-1 text-sm text-grey-2 hover:text-red"
                                onClick={() => handleRejectUser(eventDetails!.eventId, user.userId)}
                              >
                                <CloseSharpIcon className="h-5 w-5" />
                              </button>
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-md p-1 text-sm text-grey-2 hover:text-green"
                                onClick={() => handleAcceptUser(eventDetails!.eventId, user.userId)}
                              >
                                <CheckSharpIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

export default EventHistory;
