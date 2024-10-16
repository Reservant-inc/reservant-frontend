import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { fetchGET } from "../../../services/APIconn";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RemoveEventConfirmation from "./RemoveEventConfirmation";
import RemoveEventInterest from "./RemoveEventInterest";
import CreateEventThread from "./CreateEventThread";
import EventEditModal from "./EventEditModal"; // Import nowego komponentu

interface MyEventsModalProps {
  open: boolean;
  onClose: () => void;
}

const MyEventsModal: React.FC<MyEventsModalProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState<"created" | "interested">("created");
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // Przechowuje wybrane wydarzenie do edytowania

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // RemoveInterest Modal
  const [showRemoveInterestModal, setShowRemoveInterestModal] = useState<boolean>(false);

  // CreateThread Modal
  const [showCreateThreadModal, setShowCreateThreadModal] = useState<boolean>(false);

  // Fetch events created by the user
  const fetchCreatedEvents = async () => {
    try {
      const response = await fetchGET("/user/events-created");
      setCreatedEvents(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching created events:", error);
      setLoading(false);
    }
  };

  // Fetch events user is interested in
  const fetchInterestedEvents = async () => {
    try {
      const response = await fetchGET("/user/events-interested-in");
      setInterestedEvents(response.items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching interested events:", error);
      setLoading(false);
    }
  };

  // Fetch events based on active tab
  const fetchEvents = () => {
    setLoading(true);
    if (activeTab === "created") {
      fetchCreatedEvents();
    } else {
      fetchInterestedEvents();
    }
  };

  // Load events when modal opens
  useEffect(() => {
    if (open) {
      fetchEvents(); // Fetch events when modal is opened
    }
  }, [open]);

  // Fetch events when tab changes
  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const handleEditClick = (event: any) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmationClose = () => {
    setShowDeleteModal(false);
    setSelectedEventId(null);
  };

  const handleRemoveInterestClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setShowRemoveInterestModal(true);
  };

  const handleRemoveInterestClose = () => {
    setShowRemoveInterestModal(false);
    setSelectedEventId(null);
  };

  const handleEventDeleted = () => {
    fetchCreatedEvents();
  };

  const handleInterestRemoved = () => {
    fetchInterestedEvents();
  };

  const handleCreateThreadClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setShowCreateThreadModal(true);
  };

  const handleCreateThreadClose = () => {
    setShowCreateThreadModal(false);
    setSelectedEventId(null);
  };

  const isEventPast = (eventTime: string) => {
    return new Date(eventTime) < new Date();
  };

  const activeButtonStyles = "bg-primary text-white";
  const inactiveButtonStyles = "w-[180px] dark:bg-grey-6 bg-grey-0 rounded-lg text-primary hover:text-primary-2 dark:text-secondary dark:hover:text-secondary-2 hover:bg-grey-1 dark:hover:bg-grey-6 transition";

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="my-events-title" aria-describedby="my-events-description">
      <>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-96 bg-white dark:bg-grey-5 shadow-lg p-6 rounded-lg">
          <h2 id="my-events-title" className="text-xl font-bold mb-4 dark:text-white">My Events</h2>

          {/* Zmiana miedzy "Created by Me" i "Interested in" */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setActiveTab("created")}
              className={`w-[180px] rounded-lg p-2 transition-all ${activeTab === "created" ? activeButtonStyles : inactiveButtonStyles}`}
            >
              Created by me
            </button>
            <button
              onClick={() => setActiveTab("interested")}
              className={`w-[180px] rounded-lg p-2 transition-all ${activeTab === "interested" ? activeButtonStyles : inactiveButtonStyles}`}
            >
              Interested in
            </button>
          </div>

          {loading ? (
            <p className="dark:text-white">Loading events...</p>
          ) : (
            <>
              <div className="mt-6">
                {activeTab === "created" ? (
                  createdEvents.length > 0 ? (
                    createdEvents.map((event) => (
                      <div key={event.eventId} className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-semibold dark:text-white">{event.name}</p>
                          <p className="text-sm dark:text-grey-2">Time: {new Date(event.time).toLocaleString()}</p>
                          <p className="text-sm dark:text-grey-2">Restaurant: {event.restaurantName}</p>
                        </div>
                        {/* Sprawdź, czy wydarzenie się odbyło, jeśli tak, nie wyświetlaj ikon */}
                        {!isEventPast(event.time) && (
                          <>
                            <button className="" onClick={() => handleCreateThreadClick(event.eventId)}>
                              <ChatBubbleIcon className="dark:text-grey-2" />
                            </button>
                            <button className="" onClick={() => handleEditClick(event)}>
                              <EditIcon className="dark:text-grey-2" />
                            </button>
                            <button className="" onClick={() => handleDeleteClick(event.eventId)}>
                              <DeleteIcon className="dark:text-grey-2" />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="dark:text-white">No events created by you.</p>
                  )
                ) : (
                  interestedEvents.length > 0 ? (
                    interestedEvents.map((event) => (
                      <div key={event.eventId} className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-semibold dark:text-white">{event.name}</p>
                          <p className="text-sm dark:text-grey-2">Time: {new Date(event.time).toLocaleString()}</p>
                          <p className="text-sm dark:text-grey-2">Restaurant: {event.restaurantName}</p>
                        </div>
                        <button className="text-red hover:text-l-red" onClick={() => handleRemoveInterestClick(event.eventId)}>
                          <RemoveCircleIcon />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="dark:text-white">No events you are interested in.</p>
                  )
                )}
              </div>
            </>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="w-[180px] dark:bg-grey-5 bg-grey-0 rounded-lg text-primary dark:text-secondary dark:hover:bg-grey-6 hover:bg-white transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <RemoveEventConfirmation
          open={showDeleteModal}
          onClose={handleDeleteConfirmationClose}
          eventId={selectedEventId}
          onEventDeleted={handleEventDeleted}
        />

        {/* Remove Interest Confirmation Modal */}
        <RemoveEventInterest
          open={showRemoveInterestModal}
          onClose={handleRemoveInterestClose}
          eventId={selectedEventId}
          onInterestRemoved={handleInterestRemoved}
        />

        {/* Create Event Thread Modal */}
        <CreateEventThread
          open={showCreateThreadModal}
          onClose={handleCreateThreadClose}
          eventId={selectedEventId}
        />

        {/* Edit Event Modal */}
        {selectedEvent && (
          <EventEditModal
            open={showEditModal}
            onClose={handleEditModalClose}
            event={selectedEvent}
            onEventUpdated={fetchCreatedEvents} // Odswież wydarzenia po edytowaniu
          />
        )}
      </>
    </Modal>
  );
};

export default MyEventsModal;
