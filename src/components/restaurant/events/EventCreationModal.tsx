import React, { useState } from "react";
import { fetchPOST } from "../../../services/APIconn";

interface EventCreationModalProps {
  handleClose: () => void;
  restaurantId: number;
  onSuccess: (eventId: number) => void;  // Nowa funkcja przekazana z FocusedRestaurantDetails
}

const EventCreationModal: React.FC<EventCreationModalProps> = ({
  handleClose,
  restaurantId,
  onSuccess, // Funkcja do obsługi sukcesu
}) => {
  const [name, setName] = useState<string>("");  // Nowy stan dla pola name
  const [description, setDescription] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [mustJoinUntil, setMustJoinUntil] = useState<string>("");
  const [maxPeople, setMaxPeople] = useState<number | "">("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resetowanie inputów
  const resetFormFields = () => {
    setName("");  
    setDescription("");
    setTime("");
    setMustJoinUntil("");
    setMaxPeople("");
  };

  // Obsługa tworzenia eventu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      name,  
      description,
      time,
      mustJoinUntil,
      restaurantId,
      maxPeople,
    };

    try {
      const response = await fetchPOST("/events", JSON.stringify(eventData));
      resetFormFields();
      onSuccess(response.eventId);  // Wywołanie na sukcesie, przekazanie ID wydarzenia
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat();
        setErrorMessage(errorMessages.join("\n"));
      } else {
        setErrorMessage(error.message || "An unknown error occurred.");
      }
    }
  };

  return (
    <div className="w-96 bg-white dark:bg-grey-5 shadow-lg p-6 rounded-lg">
      <h2 id="modal-title" className="text-xl font-bold mb-4 dark:text-white">
        Create Event
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium dark:text-grey-2">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium dark:text-grey-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="time" className="block text-sm font-medium dark:text-grey-2">
            Event Time
          </label>
          <input
            type="datetime-local"
            id="time"
            className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="mustJoinUntil" className="block text-sm font-medium dark:text-grey-2">
            Must Join Until
          </label>
          <input
            type="datetime-local"
            id="mustJoinUntil"
            className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
            value={mustJoinUntil}
            onChange={(e) => setMustJoinUntil(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="maxPeople" className="block text-sm font-medium dark:text-grey-2">
            Max People
          </label>
          <input
            type="number"
            id="maxPeople"
            className="mt-1 block w-full p-2 border border-grey-2 rounded-md"
            value={maxPeople}
            onChange={(e) => setMaxPeople(Number(e.target.value))}
            required
            min="1"
          />
        </div>

        {errorMessage && (
          <p className="mb-4">{errorMessage}</p>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className="w-[180px] dark:bg-grey-6 bg-grey-0 rounded-lg text-primary hover:text-primary-2 dark:text-secondary dark:hover:text-secondary-2 hover:bg-grey-1 dark:hover:bg-grey-6 transition"
          >
            Create Event
          </button>
          <button
            type="button"
            onClick={handleClose} 
            className="w-[180px] dark:bg-grey-6 bg-grey-0 rounded-lg text-primary hover:text-primary-2 dark:text-secondary dark:hover:text-secondary-2 hover:bg-grey-1 dark:hover:bg-grey-6 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCreationModal;
