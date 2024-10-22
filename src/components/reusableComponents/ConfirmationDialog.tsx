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
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  confirmationText,
}) => {

  const [t] = useTranslation("global");
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("general.confirmation")}</DialogTitle>
      <DialogContent>{confirmationText}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("general.cancel")}
        </Button>
        <Button onClick={handleConfirm} color="error">
        {t("general.yes")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
