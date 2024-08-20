import { ReactNode } from "react";

export interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmationText: string; 
  }

  export interface Action {
    icon: React.ReactNode;
    name: string;
    onClick: () => void;
  }
  
  export interface MoreActionsProps {
    actions: Action[];
  }

  export interface OutsideClickHandlerProps {
    onOutsideClick: () => void;
    isPressed: boolean;
    children: ReactNode;
  }

  export interface PopupProps {
    children: ReactNode;
    buttonText?: String;
    bgColor?: String;
    modalTitle?: String;
  }