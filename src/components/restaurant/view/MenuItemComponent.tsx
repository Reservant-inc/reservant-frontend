import React, { useState } from "react";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import { MenuItemComponentProps } from "../../../services/interfaces/restaurant";
import { getImage } from "../../../services/APIconn";



const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  color: "#000",
  bgcolor: "#fefefe",
  boxShadow: 24,
  p: 4,
};

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  addToCart,
}) => {
  const [areDetailsOpen, setAreDetailsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setAreDetailsOpen(true);
  };

  const handleClose = () => {
    setAreDetailsOpen(false);
  };

  return (
    <>
      <div className="mx-auto my-4 flex max-w-3xl justify-between rounded bg-white px-6 py-4">
        <Box
          className="mr-4 rounded"
          component="img"
          sx={{
            height: 120,
            width: 120,
          }}
          src={getImage(item.photo as string)}
          alt={item.name}
        />
        <div className="flex-grow">
          <p className="flex items-center font-bold">
            {item.name}
            <IconButton
              onClick={handleOpen}
              sx={{
                bgcolor: "#a94c79",
                color: "#fefefe",
                height: 30,
                width: 30,
                ml: 2,
              }}
            >
              <InfoIcon />
            </IconButton>
          </p>
          <Typography variant="body2" color="textSecondary">
            {item.alternateName}
          </Typography>
          <p>{item.price} PLN</p>
          {item.description?.trim().length > 0 ? (
            <p>{item.description}</p>
          ) : (
            <p className="italic">Brak opisu.</p>
          )}
          {item.alcoholPercentage !== undefined &&
            item.alcoholPercentage > 0 && (
              <Typography variant="body2" color="textSecondary">
                Zawartość alkoholu: {item.alcoholPercentage}%
              </Typography>
            )}
        </div>
        <div className="flex items-center">
          <IconButton
            onClick={() => addToCart(item)}
            sx={{ bgcolor: "#a94c79", color: "#fefefe", height: 40, width: 40 }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
      <Modal
        open={areDetailsOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex items-center justify-start space-x-4">
            Informacje o składnikach
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default MenuItemComponent;
