import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ConfirmationDialogProps } from '../../services/interfaces/reusable';



const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onClose, onConfirm, confirmationText }) => {

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        {confirmationText}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
