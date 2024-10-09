import React, { useState } from "react";
import { Modal } from "@mui/material";
import { fetchPUT } from "../../../services/APIconn";

interface EventEditModalProps {
  open: boolean;
  onClose: () => void;
  event: any; // Można dodać dokładniejszy typ, jeżeli dane wydarzenia mają ustaloną strukturę
  onEventUpdated: () => void; // Callback po zapisaniu zmian
}

const EventEditModal: React.FC<EventEditModalProps> = ({ open, onClose, event, onEventUpdated }) => {
  const [description, setDescription] = useState<string>(event.description);
  const [time, setTime] = useState<string>(event.time);
  const [maxPeople, setMaxPeople] = useState<number>(event.maxPeople);
  const [mustJoinUntil, setMustJoinUntil] = useState<string>(event.mustJoinUntil);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currentParticipants = event.participants?.length || 0; // Obecna liczba uczestników

  const handleSave = async () => {
    // Sprawdzenie, czy nowe Max People jest większe lub równe liczbie obecnych uczestników
    if (maxPeople < currentParticipants) {
      setError("Max number of participants cannot be lower than current number.");
      return;
    }

    setLoading(true);
    try {
      const body = JSON.stringify({
        description,
        time,
        maxPeople,
        mustJoinUntil
      });

      await fetchPUT(`/events/${event.eventId}`, body);

      setLoading(false);
      onEventUpdated(); // Wywołaj callback po zapisaniu zmian
      onClose(); // Zamknij modal po zapisaniu
    } catch (err) {
      setLoading(false);
      setError("Failed to update the event.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-96 bg-white dark:bg-grey-5 shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Event</h2>
        {error && <p className="text-error">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium dark:text-grey-2">Description</label>
          <input
            type="text"
            className="mt-1 block w-full border border-grey-2 p-2 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium dark:text-grey-2">Event Time</label>
          <input
            type="datetime-local"
            className="mt-1 block w-full border border-grey-2 p-2 rounded-md"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium dark:text-grey-2">Must Join Until</label>
          <input
            type="datetime-local"
            className="mt-1 block w-full border border-grey-2 p-2 rounded-md"
            value={mustJoinUntil}
            onChange={(e) => setMustJoinUntil(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium dark:text-grey-2">
            Max People (Current participants: {currentParticipants})
          </label>
          <input
            type="number"
            className="mt-1 block w-full border border-grey-2 p-2 rounded-md"
            value={maxPeople}
            onChange={(e) => setMaxPeople(Number(e.target.value))}
            min={currentParticipants} // Minimalna liczba osób to liczba obecnych uczestników
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="bg-grey-4 text-white px-4 py-2 rounded hover:bg-grey-3"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EventEditModal;
