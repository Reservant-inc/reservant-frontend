import React, { useEffect, useState } from "react";
import { getImage, fetchPOST, fetchGET, fetchDELETE } from "../../../services/APIconn";
import Cookies from "js-cookie";

interface Participant {
  userId: string;
  firstName: string;
  lastName: string;
  photo: string | null;
}

interface Event {
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
  photo: string | null;
  numberInterested: number;
}

interface FocusedRestaurantEventDetailsProps {
  event: Event;
}

const FocusedRestaurantEventDetails: React.FC<FocusedRestaurantEventDetailsProps> = ({ event }) => {
  const userId = JSON.parse(Cookies.get("userInfo") as string).userId;
  const isCreator = userId === event.creator.userId;
  const [participants, setParticipants] = useState<Participant[]>([]);
  const isParticipant = participants.some((participant) => participant.userId === userId);

  const fetchParticipants = async () => {
    try {
      const data = await fetchGET(`/events/${event.eventId}`);
      setParticipants(data.participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleInterestClick = async () => {
    try {
      await fetchPOST(`/events/${event.eventId}/interested`);
      fetchParticipants();
    } catch (error) {
      console.error("Error sending interest request:", error);
    }
  };

  const handleLeaveEventClick = async () => {
    try {
      await fetchDELETE(`/events/${event.eventId}/interested`);
      fetchParticipants();
    } catch (error) {
      console.error("Error leaving event:", error);
    }
  };

  return (
    <div className="p-0 rounded-lg dark:text-grey-1 bg-grey-1">
      {event.photo && (
        <img
          src={getImage(event.photo, "")}
          alt={`${event.name} event`}
          className="w-full h-auto rounded-t-lg object-cover"
          style={{ maxHeight: "200px" }}
        />
      )}
      <div className="p-3">
        <h2 className="font-bold text-xl text-left">{event.name}</h2>
        <p className="text-left mb-4">{event.description}</p>

        <div className="flex justify-between text-sm text-left">
          {/* lewa */}
          <div className="flex flex-col gap-2">
            <p><strong>Event Time:</strong> {new Date(event.time).toLocaleString()}</p>
            <p><strong>Join Until:</strong> {new Date(event.mustJoinUntil).toLocaleString()}</p>
            <p><strong>Created by:</strong> {event.creator.firstName} {event.creator.lastName}</p>
          </div>

          {/* prawa */}
          <div className="flex flex-col gap-2">
            <p><strong>Participants:</strong> {event.numberInterested}</p>
            <p><strong>Max Participants:</strong> {event.maxPeople}</p>
          </div>
        </div>

        {/* Interest Button */}
        <div className="mt-4 flex justify-center">
          {!isCreator && (
            <button
              onClick={isParticipant ? handleLeaveEventClick : handleInterestClick}
              className={`w-3/4 py-2 rounded-lg transition hover:scale-105 ${
                isParticipant
                  ? "bg-primary text-white hover:bg-primary-2"
                  : "bg-primary text-white hover:bg-primary-2"
              }`}
            >
              {isParticipant ? "Opuść wydarzenie" : "Zainteresuj się"}
            </button>
          )}
          {isCreator && (
            <button
              disabled
              className="w-3/4 py-2 rounded-lg bg-grey-3 text-black cursor-not-allowed"
            >
              Jesteś twórcą tego eventu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusedRestaurantEventDetails;
