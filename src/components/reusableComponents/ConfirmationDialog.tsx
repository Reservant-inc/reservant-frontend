import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmationText: string;
  onAlt?: () => void;
  altText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onAlt,
  altText,
  confirmationText,
}) => {
  const { t } = useTranslation("global");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>{confirmationText}</DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} >
          Yes
        </Button>
        {(onAlt || altText) &&
        <Button onClick={onAlt} color="error">
          {altText}  
        </Button>}
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
