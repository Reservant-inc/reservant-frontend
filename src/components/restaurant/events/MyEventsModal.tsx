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

interface MyEventsModalProps {
  open: boolean;
  onClose: () => void;
}

const MyEventsModal: React.FC<MyEventsModalProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState<"created" | "interested">("created");
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // RemoveInterest Modal
  const [showRemoveInterestModal, setShowRemoveInterestModal] = useState<boolean>(false);

  // CreateThread Modal
  const [showCreateThreadModal, setShowCreateThreadModal] = useState<boolean>(false);

  // Eventy stworzone przez usera
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

  // Eventy zainteresowane usera
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

  // Fetch eventow w zaleznosci od aktywnej zakladki
  useEffect(() => {
    setLoading(true);
    if (activeTab === "created") {
      fetchCreatedEvents();
    } else {
      fetchInterestedEvents();
    }
  }, [activeTab]);

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

  const activeButtonStyles = "bg-primary text-white";
  const inactiveButtonStyles = "bg-grey-0 text-primary dark:text-secondary";

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="my-events-title" aria-describedby="my-events-description">
      <>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-96 bg-white shadow-lg p-6 rounded-lg">
          <h2 id="my-events-title" className="text-xl font-bold mb-4">My Events</h2>

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
            <p>Loading events...</p>
          ) : (
            <>
              <div className="mt-6">
                {activeTab === "created" ? (
                  createdEvents.length > 0 ? (
                    createdEvents.map((event) => (
                      <div key={event.eventId} className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-semibold">{event.description}</p>
                          <p className="text-sm">Time: {new Date(event.time).toLocaleString()}</p>
                          <p className="text-sm">Restaurant: {event.restaurantName}</p>
                        </div>
                        <button className="" onClick={() => handleCreateThreadClick(event.eventId)}>
                          <ChatBubbleIcon />
                        </button>
                        <button className="" onClick={() => handleDeleteClick(event.eventId)}>
                          <DeleteIcon />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No events created by you.</p>
                  )
                ) : (
                  interestedEvents.length > 0 ? (
                    interestedEvents.map((event) => (
                      <div key={event.eventId} className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-semibold">{event.description}</p>
                          <p className="text-sm text-gray-500">Time: {new Date(event.time).toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Restaurant: {event.restaurantName}</p>
                        </div>
                        <button className="text-red-600 hover:text-red-800" onClick={() => handleRemoveInterestClick(event.eventId)}>
                          <RemoveCircleIcon />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No events you are interested in.</p>
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
      </>
    </Modal>
  );
};

export default MyEventsModal;
