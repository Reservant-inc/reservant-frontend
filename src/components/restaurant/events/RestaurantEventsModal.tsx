import React, { useEffect, useState } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";
import { fetchGET } from "../../../services/APIconn";
import InfoIcon from "@mui/icons-material/Info";
import RestaurantEventDetails from "./RestaurantEventDetails";

interface RestaurantEventsModalProps {
  open: boolean;
  onClose: () => void;
  restaurantId: number;
}

const RestaurantEventsModal: React.FC<RestaurantEventsModalProps> = ({
  open,
  onClose,
  restaurantId,
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetchGET(`/restaurants/${restaurantId}/events`);
        setEvents(response.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    if (open) {
      fetchEvents();
    }
  }, [restaurantId, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Restaurant Events</h2>
        
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : events.length === 0 ? (
          <p>No events available for this restaurant.</p>
        ) : (
          <div>
            {events.map((event) => (
              <div
                key={event.eventId}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <p className="font-semibold">{event.description}</p>
                  <p className="text-sm">Time: {new Date(event.time).toLocaleString()}</p>
                  <p className="text-sm">Created by: {event.creatorFullName}</p>
                </div>
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedEventId(event.eventId)} // Otworzenie Details Modal
                >
                  <InfoIcon />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>

        {/* Event Details Modal */}
        {selectedEventId && (
          <RestaurantEventDetails
            open={!!selectedEventId}
            onClose={() => setSelectedEventId(null)} // Zamkniecie
            eventId={selectedEventId}
          />
        )}
      </Box>
    </Modal>
  );
};

export default RestaurantEventsModal;
