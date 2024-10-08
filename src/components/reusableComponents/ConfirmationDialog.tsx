import React, { ReactNode } from "react";
import {
  Dialog,
} from "@mui/material";
import { createPortal } from "react-dom";

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
  
  return createPortal(
    <Dialog open={open} onClose={onClose}>
      <div>
        {children}
      </div>
    </Dialog>,
    document.getElementById('modal') || document.body
  );
};

export default ConfirmationDialog;
