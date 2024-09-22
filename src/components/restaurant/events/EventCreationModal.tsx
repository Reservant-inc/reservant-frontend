import React, { useState } from "react";
import { Modal } from "@mui/material";
import { fetchPOST } from "../../../services/APIconn";
import EventDetailsModal from "./EventDetailsModal";
import MyEventsModal from "./MyEventsModal";

interface EventCreationModalProps {
  open: boolean;
  handleClose: () => void;
  restaurantId: number;
}

const EventCreationModal: React.FC<EventCreationModalProps> = ({
  open,
  handleClose,
  restaurantId,
}) => {
  const [description, setDescription] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [mustJoinUntil, setMustJoinUntil] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [eventId, setEventId] = useState<number | null>(null);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState<boolean>(false);
  const [showMyEventsModal, setShowMyEventsModal] = useState<boolean>(false);
  const [maxPeople, setMaxPeople] = useState<number | "">("");


  // Resetowanie inputów
  const resetFormFields = () => {
    setDescription("");
    setTime("");
    setMustJoinUntil("");
    setMaxPeople("");
  };

  // Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      description,
      time,
      mustJoinUntil,
      restaurantId,
      maxPeople,
    };
    

    try {
      const response = await fetchPOST("/events", JSON.stringify(eventData));
      console.log(response);
      setEventId(response.eventId);
      handleClose(); // Zamknięcie modala
      resetFormFields(); // Czyszczenie inputów po stworzeniu eventu
      setIsSuccess(true);
      setShowResultModal(true);
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat();
        setErrorMessage(errorMessages.join("\n"));
      } else {
        setErrorMessage(error.message || "An unknown error occurred.");
      }
      setIsSuccess(false);
      setShowResultModal(true);
    }
  };

  const handleModalClose = () => {
    resetFormFields(); // Resetowanie inputów przy zamknięciu modala
    handleClose(); // close z rodzica
  };

  const handleShowDetails = () => {
    setShowResultModal(false);
    setShowEventDetailsModal(true);
  };

  const handleGoToMyEvents = () => {
    setShowResultModal(false); // Zamkniecie modala o stworzeniu eventu
    setShowMyEventsModal(true); // Otworzenie MyEvents
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-grey-5 shadow-lg p-6 rounded-lg">
          <h2 id="modal-title" className="text-xl font-bold mb-4 dark:text-white">
            Create Event
          </h2>
          <form onSubmit={handleSubmit}>
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

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="submit"
                className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary"
              >
                Create Event
              </button>
              <button
                type="button"
                onClick={handleModalClose} 
                className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Success/Error Modal */}
      <Modal open={showResultModal} onClose={() => setShowResultModal(false)}>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-80 bg-white dark:bg-grey-5 shadow-lg p-6 rounded-lg">
          <h2 className={`text-xl font-bold mb-4 ${isSuccess ? "text-green" : "text-error"}`}>
            {isSuccess ? "Event Created!" : "Error"}
          </h2>
          <p className="dark:text-grey-2 mb-4 whitespace-pre-wrap">
            {isSuccess ? "Your event was successfully created!" : errorMessage}
          </p>
          <div className="flex justify-end space-x-4">
            {isSuccess && (
              <>
                <button
                  onClick={handleGoToMyEvents}
                  className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary"
                >
                  Go to My Events
                </button>
                <button
                  onClick={handleShowDetails}
                  className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary"
                >
                  Show Details
                </button>
              </>
            )}
            <button
              onClick={() => setShowResultModal(false)}
              className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* EventDetails Modal */}
      {eventId && (
        <EventDetailsModal
          eventId={eventId}
          open={showEventDetailsModal}
          onClose={() => setShowEventDetailsModal(false)}
        />
      )}

      {/* MyEvents Modal */}
      <MyEventsModal
        open={showMyEventsModal}
        onClose={() => setShowMyEventsModal(false)}
      />
    </>
  );
};

export default EventCreationModal;
