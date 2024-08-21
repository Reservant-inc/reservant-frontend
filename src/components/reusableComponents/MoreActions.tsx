import React from "react";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface Action {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

interface MoreActionsProps {
  actions: Action[];
}

const MoreActions: React.FC<MoreActionsProps> = ({ actions }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {actions.map((action, index) => (
          <MenuItem key={index} onClick={action.onClick}>
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText primary={action.name} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreActions;
