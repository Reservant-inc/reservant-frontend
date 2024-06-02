import React, { useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConfirmationDialog from './ConfirmationDialog';

interface Action {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

interface MoreActionsProps {
  actions: Action[];
  name: string;
}

const MoreActions: React.FC<MoreActionsProps> = ({ actions, name }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [onDeleteAction, setOnDeleteAction] = useState<() => void>(() => () => {});

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (onDelete: () => void) => {
    
    setOnDeleteAction(() => onDelete);
    console.log("i'm here")
    setOpenConfirmation(true);
    handleMenuClose();
  };

  const handleConfirmationClose = () => {
    setOpenConfirmation(false);
  };

  const handleConfirmDelete = () => {
    onDeleteAction();
    setOpenConfirmation(false);
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon className="text-black dark:text-grey-2" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {actions.map((action, index) => (
          <MenuItem
          key={index}
          onClick={action.name === 'Delete' ? () => handleDeleteClick(action.onClick) : action.onClick}
        >
          <ListItemIcon>{action.icon}</ListItemIcon>
          <ListItemText primary={action.name} />
        </MenuItem>
        ))}
      </Menu>
      <ConfirmationDialog
        open={openConfirmation}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmDelete}
        confirmationText={`Are you sure you want to delete ${name} ?`}
      />
    </>
  );
};

export default MoreActions;
