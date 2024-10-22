import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { fetchPUT } from "../../../services/APIconn";

interface EventEditModalProps {
  open: boolean;
  onClose: () => void;
  event: any; // Na razie tak bo ostatnio dodano name i ma być zdjecie wiec zeby sie nie rozsypalo
  onEventUpdated: () => void; // Callback po zapisaniu zmian
}

const EventEditModal: React.FC<EventEditModalProps> = ({ open, onClose, event, onEventUpdated }) => {
  const [name, setName] = useState<string>(event.name);
  const [description, setDescription] = useState<string>(event.description);
  const [time, setTime] = useState<string>(event.time);
  const [maxPeople, setMaxPeople] = useState<number>(event.maxPeople);
  const [mustJoinUntil, setMustJoinUntil] = useState<string>(event.mustJoinUntil);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Zmienna do wyświetlania błędów

  useEffect(() => {
    // Zresetowanie pól formularza przy otwarciu modala
    if (open) {
      setName(event.name);
      setDescription(event.description);
      setTime(event.time);
      setMaxPeople(event.maxPeople);
      setMustJoinUntil(event.mustJoinUntil);
      setErrorMessage(null); // Zresetuj błędy
    }
  }, [open, event]);

  const currentParticipants = event.participants?.length || 0;

  const handleSave = async () => {
    if (maxPeople < currentParticipants) {
      setErrorMessage("Max number of participants cannot be lower than current number.");
      return;
    }

    setLoading(true);
    setErrorMessage(null); // Resetujemy błędy

    try {
      const body = JSON.stringify({
        name,
        description,
        time,
        maxPeople,
        mustJoinUntil,
        restaurantId: event.restaurantId,
      });

      const response = await fetchPUT(`/events/${event.eventId}`, body);

      setLoading(false);
      onEventUpdated(); // Wywołanie callback po sukcesie
      onClose(); // Zamknięcie modala po sukcesie
    } catch (error: any) {
      setLoading(false);

      // Obsługa błędów serwera
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat();
        setErrorMessage(errorMessages.join("\n"));
      } else {
        setErrorMessage(error.message || "Failed to update the event.");
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-grey-5 shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Event</h2>

        {/* Wyświetlanie błędów z serwera */}
        {errorMessage && (
          <p className="text-red-500 mb-4">{errorMessage}</p>
        )}

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-grey-2">Event Name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-grey-2">Description</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-grey-2">Event Time</label>
            <input
              type="datetime-local"
              className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-grey-2">Must Join Until</label>
            <input
              type="datetime-local"
              className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
              value={mustJoinUntil}
              onChange={(e) => setMustJoinUntil(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-grey-2">
              Max People (Current participants: {currentParticipants})
            </label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
              value={maxPeople}
              onChange={(e) => setMaxPeople(Number(e.target.value))}
              min={currentParticipants}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-grey-4 text-white px-4 py-2 rounded hover:bg-grey-3"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-2"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EventEditModal;
