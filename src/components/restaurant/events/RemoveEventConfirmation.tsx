import React from "react";
import { Modal } from "@mui/material";
import { fetchDELETE } from "../../../services/APIconn";

interface RemoveEventConfirmationProps {
  open: boolean;
  onClose: () => void;
  eventId: number | null;
  onEventDeleted: () => void;
}

const RemoveEventConfirmation: React.FC<RemoveEventConfirmationProps> = ({
  open,
  onClose,
  eventId,
  onEventDeleted,
}) => {
  const handleDelete = async () => {
    if (eventId === null) return;
    try {
      // usuwanie eventu
      await fetchDELETE(`/events/${eventId}`);
      onEventDeleted();
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-grey-0 dark:bg-grey-5 shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Do you want to delete this event?</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleDelete}
            className="w-[180px] bg-grey-0 dark:bg-grey-5 rounded-lg text-primary dark:text-white hover:bg-grey-1 dark:hover:bg-grey-6 transition-all"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="w-[180px] bg-grey-0 dark:bg-grey-5 rounded-lg text-primary dark:text-white hover:bg-grey-1 dark:hover:bg-grey-6 transition-all"
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveEventConfirmation;
