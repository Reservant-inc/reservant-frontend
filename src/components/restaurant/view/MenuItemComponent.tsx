import { Box, IconButton, Modal } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";

interface MenuItemComponentProps {
  item: any;
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

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ item }) => {
  const [areDetailsOpen, setAreDetailsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setAreDetailsOpen(true);
  };

  const handleClose = () => {
    setAreDetailsOpen(false);
  };

  return (
    <>
      <div className="my-4 flex justify-between rounded bg-white p-4	">
        <div>
          <p className="font-bold">
            {item.name}{" "}
            <IconButton
              onClick={handleOpen}
              sx={{
                bgcolor: "#a94c79",
                color: "#fefefe",
                height: 30,
                width: 30,
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
        <div className="flex space-x-4">
          <Box
            className="rounded"
            component="img"
            sx={{
              height: 80,
            }}
            src="https://source.unsplash.com/grilled-fish-cooked-vegetables-and-fork-on-plate-bpPTlXWTOvg"
            alt=""
          />
          <IconButton
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
              Informacje o składnikach, alergenach(?)
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default MenuItemComponent;
