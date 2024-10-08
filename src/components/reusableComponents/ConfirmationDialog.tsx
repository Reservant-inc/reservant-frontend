import React, { ReactNode } from "react";
import {
  Dialog,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  children,
}) => {
  
  return (
    <Dialog open={open} onClose={onClose}>
      <div>
        {children}
      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;
