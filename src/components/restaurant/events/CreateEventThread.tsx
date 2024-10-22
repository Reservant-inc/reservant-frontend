import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { fetchGET, fetchPOST } from "../../../services/APIconn";

interface CreateEventThreadProps {
  open: boolean;
  onClose: () => void;
  eventId: number | null;
}

const CreateEventThread: React.FC<CreateEventThreadProps> = ({ open, onClose, eventId }) => {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pobieranie eventu
  useEffect(() => {
    if (eventId) {
      const fetchEventDetails = async () => {
        try {
          const response = await fetchGET(`/events/${eventId}`);
          setEventData(response);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching event details:", error);
          setError("Failed to load event details.");
          setLoading(false);
        }
      };
      fetchEventDetails();
    }
  }, [eventId]);

  const handleCreateThread = async () => {
    if (!eventData) return;

    const { description: title, creatorId, interested } = eventData;

    // Id kreatora + zainteresowanych do tworzenia wątku
    const participantIds = [creatorId, ...interested.map((user: any) => user.userId)];

    const threadData = {
      title,
      participantIds,
    };

    try {
      // Tworzenie wątku
      const response = await fetchPOST("/threads", JSON.stringify(threadData));
      console.log("Thread created:", response);
      onClose(); // Zamknij modal po stworzeniu wątku
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  if (!open || !eventId) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-grey-5 shadow-lg p-6 rounded-lg">
        {loading ? (
          <p className="dark:text-white">Loading event details...</p>
        ) : error ? (
          <p className="text-red-500 dark:text-red-400">{error}</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Do you want to create a thread for this event?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCreateThread}
                className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary dark:text-secondary dark:hover:bg-grey-6 hover:bg-white transition-all"
              >
                Yes
              </button>
              <button
                onClick={onClose}
                className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary dark:text-secondary dark:hover:bg-grey-6 hover:bg-white transition-all"
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CreateEventThread;
