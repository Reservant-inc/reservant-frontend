import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { fetchGET, fetchPOST, fetchDELETE } from "../../../services/APIconn";

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

  // Pobranie eventow i danych o userze
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await fetchGET(`/events/${eventId}`);
        const userResponse = await fetchGET(`/user`);

        setEventDetails(eventResponse);
        setUser(userResponse);

        // Sprawdzenie czy user jest zainteresowany eventem
        const isUserInterested = eventResponse.interested.some(
          (participant: any) => participant.userId === userResponse.userId
        );
        setInterested(isUserInterested);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details or user info:", error);
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [eventId, open]);

  const handleToggleInterest = async () => {
    try {
      if (interested) {
        // Odnzacz zainteresowanie
        await fetchDELETE(`/events/${eventId}/interested`);
      } else {
        // Zaznacz zainteresowanie
        await fetchPOST(`/events/${eventId}/interested`, JSON.stringify({}));
      }
      // Odswiezenie
      setInterested(!interested);
    } catch (error) {
      console.error("Error toggling interest status:", error);
    }
  };

  if (!open || !eventDetails || !user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-96 bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Event Details</h2>

        {loading ? (
          <p>Loading event details...</p>
        ) : (
          <>
            <p><strong>Event ID:</strong> {eventDetails.eventId}</p>
            <p><strong>Created At:</strong> {eventDetails.createdAt}</p>
            <p><strong>Description:</strong> {eventDetails.description}</p>
            <p><strong>Event Time:</strong> {eventDetails.time}</p>
            <p><strong>Must Join Until:</strong> {eventDetails.mustJoinUntil}</p>
            <p><strong>Creator:</strong> {eventDetails.creatorFullName}</p>
            <p><strong>Restaurant:</strong> {eventDetails.restaurantName}</p>

            {user.userId === eventDetails.creatorId ? (
              <p>You are the creator of this event.</p>
            ) : (
              <>
                <button
                  className="w-full mt-4 dark:bg-grey-5 bg-grey-0 rounded-lg dark:text-secondary text-primary dark:hover:bg-secondary dark:hover:text-black hover:text-white hover:bg-primary transition hover:scale-105"
                  onClick={handleToggleInterest}
                >
                  {interested ? "Not Interested" : "Interested"}
                </button>
              </>
            )}
          </>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RestaurantEventDetails;
