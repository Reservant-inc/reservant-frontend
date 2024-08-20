import React, { useState } from "react";
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import { fetchPOST } from "../../../../services/APIconn";
import { RestaurantCreateEventProps } from "../../../../services/interfaces/restaurant";

const RestaurantCreateEvent: React.FC<RestaurantCreateEventProps> = ({
  open,
  handleClose,
  restaurantName,
  restaurantId,
}) => {
  const [tematyka, setTematyka] = useState("");
  const [dataWydarzenia, setDataWydarzenia] = useState<Date | null>(new Date());
  const [koniecPrzyjmowaniaZgloszen, setKoniecPrzyjmowaniaZgloszen] =
    useState<Date | null>(new Date());
  const [opis, setOpis] = useState("");

  const handleSubmit = async () => {
    const eventBody = {
      description: opis || "",
      time: "2024-08-10T00:00:00.000Z", // Hardcoded for now
      mustJoinUntil: "2024-08-02T00:00:00.000Z", // Hardcoded for now
      restaurantId: restaurantId,
    };

    try {
      const response = await fetchPOST("/events", JSON.stringify(eventBody));
      console.log("Event created:", response);
    } catch (error) {
      console.error("Error creating event:", error);
    }

    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Tworzenie wydarzenia dla lokalu {restaurantName}
        </Typography>
        <Box
          component="form"
          mt={2}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          {/* 1. Tematyka */}
          <TextField
            label="Tematyka"
            value={tematyka}
            onChange={(e) => setTematyka(e.target.value)}
            fullWidth
            variant="outlined"
          />

          {/* 3. Opis (opcjonalny) */}
          <TextField
            label="Opis (opcjonalny)"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            multiline
            rows={4}
            fullWidth
            className="clean-input"
            variant="outlined"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              sx={{
                mr: 2,
                bgcolor: "#a94c79",
                "&:hover": {
                  bgcolor: "#8c3b61",
                },
              }}
            >
              Stwórz
            </Button>
            <Button onClick={handleClose} color="secondary">
              Anuluj
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default RestaurantCreateEvent;
