import React, { useState } from "react";
import { Box, IconButton, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import defaultImage from "../../../assets/images/defaulImage.jpeg";
import { MenuItem as MenuItemType } from "../../../services/interfaces";

interface MenuItemComponentProps {
  item: MenuItemType;
  addToCart: (item: Omit<MenuItemType, "quantity">) => void;
}

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
        <div>
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
          <p>{item.price} zł</p>
          {item.description.replace(/\s/g, "").length > 0 ? (
            <p>{item.description}</p>
          ) : (
            <p className="italic">Brak opisu.</p>
          )}
        </div>
        <div className="flex items-center">
          <Box
            className="mr-4 rounded"
            component="img"
            sx={{
              height: 90,
              width: 100,
            }}
            src={defaultImage}
            alt="default image"
          />
          <IconButton
            onClick={() => addToCart(item)}
            sx={{ bgcolor: "#a94c79", color: "#fefefe", height: 30, width: 30 }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
      <div className="flex justify-end">
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
      </div>
    </>
  );
};

export default MenuItemComponent;
