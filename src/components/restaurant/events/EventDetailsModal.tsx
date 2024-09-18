import React, { useState } from "react";
import { Modal } from "@mui/material";
import { fetchGET, fetchDELETE } from "../../../services/APIconn";
import MyEventsModal from "./MyEventsModal";

interface EventDetailsModalProps {
  eventId: number;
  open: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
    eventId,
    open,
    onClose,
  }) => {
    const [eventDetails, setEventDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showRemovedModal, setShowRemovedModal] = useState<boolean>(false);
    const [showMyEventsModal, setShowMyEventsModal] = useState<boolean>(false);
  
    const fetchEventDetails = async () => {
      try {
        const data = await fetchGET(`/events/${eventId}`);
        setEventDetails(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch event details.");
        setLoading(false);
      }
    };
  
    const handleDeleteEvent = async () => {
      try {
        await fetchDELETE(`/events/${eventId}`);
        onClose();
        setTimeout(() => {
          setShowRemovedModal(true); // Wyswietlenie Event Removed po malym opoznieniu (naprawic potem)
        }, 300);
      } catch (err) {
        console.error("Error deleting event:", err);
        setError("Failed to delete event.");
      }
    };
  
    const handleGoToMyEvents = () => {
      onClose(); // Zamkniecie EventDetailsModal
      setShowMyEventsModal(true); // Otworzenie MyEventsModal
    };
  
    React.useEffect(() => {
      if (open) {
        fetchEventDetails();
      }
    }, [eventId, open]);
  
    if (!open) return null;
  
    return (
      <>
        <Modal open={open} onClose={onClose}>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-96 bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Event Details</h2>
  
            {loading && <p>Loading event details...</p>}
            {error && <p className="">{error}</p>}
  
            {eventDetails && (
              <div>
                <p><strong>Event ID:</strong> {eventDetails.eventId}</p>
                <p><strong>Created At:</strong> {eventDetails.createdAt}</p>
                <p><strong>Description:</strong> {eventDetails.description}</p>
                <p><strong>Event Time:</strong> {eventDetails.time}</p>
                <p><strong>Must Join Until:</strong> {eventDetails.mustJoinUntil}</p>
                <p><strong>Creator:</strong> {eventDetails.creatorFullName}</p>
                <p><strong>Restaurant:</strong> {eventDetails.restaurantName}</p>
              </div>
            )}
  
            <div className="flex justify-end mt-6 space-x-4">
              <button onClick={handleGoToMyEvents} className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary">
                Go to My Events
              </button>
              <button onClick={handleDeleteEvent} className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary">
                Delete Event
              </button>
              <button onClick={onClose} className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
  
        {/* MyEvents Modal */}
        <MyEventsModal open={showMyEventsModal} onClose={() => setShowMyEventsModal(false)} />
      </>
    );
  };
  
  export default EventDetailsModal;