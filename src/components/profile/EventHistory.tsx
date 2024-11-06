import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ListItemButton, CircularProgress } from "@mui/material";
import { fetchGET, fetchDELETE, getImage } from "../../services/APIconn";
import Dialog from "../reusableComponents/Dialog";
import SearchIcon from "@mui/icons-material/Search";

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

const EventHistory: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"created" | "interested">("created");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null);

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

  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      const endpoint = activeTab === "created"
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
      setFilteredEvents(
        events.filter((event) => event.name.toLowerCase().includes(query))
      );
    } else {
      setFilteredEvents(events);
    }
  };
  // Jeśli userId == userId twórcy eventu to do created. Jeśli nie to do interested
  const filteredTabEvents = filteredEvents.filter((event) =>
    activeTab === "created" ? event.creator.userId === userId : event.creator.userId !== userId
  );

  return (
    <div className="flex flex-col p-4">
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
          <div className="flex flex-col gap-4">
            {filteredTabEvents.length === 0 ? (
              <p className="italic text-center">
                {activeTab === "created"
                  ? "Brak utworzonych wydarzeń."
                  : "Brak zainteresowanych wydarzeń."}
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
                    <strong>Data wydarzenia:</strong>{" "}
                    {new Date(event.time).toLocaleString()}
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
                    </div>
                  ) : (
                    <button
                      className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105 mt-4"
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
        </>
      )}
    </div>
  );
};

export default EventHistory;
