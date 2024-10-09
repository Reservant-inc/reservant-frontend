import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { fetchGET, fetchPOST, fetchDELETE, getImage } from "../../../services/APIconn";

interface RestaurantEventDetailsProps {
  open: boolean;
  onClose: () => void;
  eventId: number;
}

const RestaurantEventDetails: React.FC<RestaurantEventDetailsProps> = ({
  open,
  onClose,
  eventId,
}) => {
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [interested, setInterested] = useState<boolean>(false);

  // Funkcja do pobierania danych o wydarzeniu i użytkowniku
  const fetchData = async () => {
    try {
      const eventResponse = await fetchGET(`/events/${eventId}`);
      const userResponse = await fetchGET(`/user`);

      setEventDetails(eventResponse);
      setUser(userResponse);

      // Sprawdzenie, czy użytkownik jest uczestnikiem wydarzenia
      const isUserInterested = eventResponse.participants.some(
        (participant: any) => participant.userId === userResponse.userId
      );
      setInterested(isUserInterested);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching event details or user info:", error);
      setLoading(false);
    }
  };

  // Pobranie danych przy otwarciu modala
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [eventId, open]);

  // Funkcja do obsługi zmiany zainteresowania
  const handleToggleInterest = async () => {
    try {
      if (interested) {
        await fetchDELETE(`/events/${eventId}/interested`);
      } else {
        await fetchPOST(`/events/${eventId}/interested`, JSON.stringify({}));
      }
      // Odswieżenie danych po kliknięciu "Interested"
      await fetchData();
    } catch (error) {
      console.error("Error toggling interest status:", error);
    }
  };

  // Funkcja do usunięcia uczestnika
  const handleRejectUser = async (userId: string) => {
    try {
      await fetchPOST(`/events/${eventId}/reject-user/${userId}`, JSON.stringify({}));
      // Odswież dane po usunięciu uczestnika
      await fetchData();
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  if (!open || !eventDetails || !user) return null;

  const currentParticipants = eventDetails?.participants?.length || 0;
  const maxParticipantsReached = currentParticipants >= eventDetails.maxPeople;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-96 bg-white dark:bg-grey-5 shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Event Details</h2>

        {loading ? (
          <p className="dark:text-grey-2">Loading event details...</p>
        ) : (
          <>
            <p className="dark:text-white"><strong>Event ID:</strong> {eventDetails.eventId}</p>
            <p className="dark:text-white"><strong>Created At:</strong> {eventDetails.createdAt}</p>
            <p className="dark:text-white"><strong>Description:</strong> {eventDetails.description}</p>
            <p className="dark:text-white"><strong>Event Time:</strong> {eventDetails.time}</p>
            <p className="dark:text-white"><strong>Must Join Until:</strong> {eventDetails.mustJoinUntil}</p>
            <p className="dark:text-white"><strong>Creator:</strong> {eventDetails.creatorFullName}</p>
            <p className="dark:text-white"><strong>Restaurant:</strong> {eventDetails.restaurantName}</p>
            <p className="dark:text-white"><strong>Participants:</strong> {currentParticipants} / {eventDetails.maxPeople}</p>

            {currentParticipants > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold dark:text-white">Participants:</h3>
                <ul>
                  {eventDetails.participants.map((participant: any) => (
                    <li key={participant.userId} className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={getImage(participant.photo, "")}
                          alt={`${participant.firstName} ${participant.lastName}`}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="dark:text-white">{participant.firstName} {participant.lastName}</span>
                      </div>
                      {user.userId === eventDetails.creatorId && (
                        <button
                          onClick={() => handleRejectUser(participant.userId)}
                          className="text-red hover:text-l-red"
                        >
                          -
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {user.userId === eventDetails.creatorId ? (
              <p className="dark:text-grey-2">You are the creator of this event.</p>
            ) : (
              <>
                {maxParticipantsReached && !interested ? (
                  <p className="text-error mt-4">Max number of participants reached</p>
                ) : (
                  <button
                    className="w-full mt-4 dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary transition hover:scale-105"
                    onClick={handleToggleInterest}
                    disabled={maxParticipantsReached && !interested}
                  >
                    {interested ? "Not Interested" : "Interested"}
                  </button>
                )}
              </>
            )}
          </>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-grey-4 text-white rounded hover:bg-grey-3"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RestaurantEventDetails;
