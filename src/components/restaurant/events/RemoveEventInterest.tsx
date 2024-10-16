import React from "react";
import { Modal } from "@mui/material";
import { fetchDELETE } from "../../../services/APIconn";

interface RemoveEventInterestProps {
  open: boolean;
  onClose: () => void;
  eventId: number | null;
  onInterestRemoved: () => void;
}

const RemoveEventInterest: React.FC<RemoveEventInterestProps> = ({
  open,
  onClose,
  eventId,
  onInterestRemoved,
}) => {
  const handleRemoveInterest = async () => {
    if (eventId === null) return;
    try {
      // Usuwanie zainteresowania z eventu
      await fetchDELETE(`/events/${eventId}/interested`);
      // Odswiezenie
      onInterestRemoved();
      // Zamkniecie modala
      onClose();
    } catch (error) {
      console.error("Error removing interest from event:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-grey-5 shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Do you want to remove your interest in this event?
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleRemoveInterest}
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
      </div>
    </Modal>
  );
};

export default RemoveEventInterest;
