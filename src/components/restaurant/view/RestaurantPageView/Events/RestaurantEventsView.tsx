import React, { useState, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import RestaurantCreateEvent from "./RestaurantCreateEvent";
import { fetchGET, getImage } from "../../../../../services/APIconn";
import DefaultPic from "../../../../../assets/images/no-image.png"

interface Event {
  eventId: number;
  description: string;
  time: string;
  mustJoinUntil: string;
  creatorFullName: string;
  numberInterested: number;
}

interface RestaurantEventsViewProps {
  restaurantId: number;
  events: Event[];
  restaurantName: string;
}

const RestaurantEventsView: React.FC<RestaurantEventsViewProps> = ({
  restaurantId,
  events,
  restaurantName,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const data = await fetchGET(`/restaurants/${restaurantId}`);
        setLogo(data.logo);
        setCity(data.city);
      } catch (error) {
        console.error("Error fetching restaurant logo:", error);
      }
    };

    fetchLogo();
  }, [restaurantId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      TYMCZASOWO:
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Dodaj event
      </Button>
      {events.length > 0 ? (
        events.map((event) => (
          <Box
            key={event.eventId}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "8px",
              m: 2,
              pb: 2,
              maxWidth: 300,
            }}
          >
            <Box
              component="img"
              src={getImage(logo, DefaultPic)}
              alt="Restaurant Logo"
              sx={{
                width: "100%",
                height: 100,
                objectFit: "cover",
                borderRadius: "8px 8px 0 0",
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {formatDate(event.time)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
              {restaurantName} - Tematyka
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {event.creatorFullName} - {city}
            </Typography>
            <Typography variant="body2">
              {event.numberInterested} - interested
            </Typography>
          </Box>
        ))
      ) : (
        <Typography>No events available</Typography>
      )}
      <RestaurantCreateEvent
        open={open}
        handleClose={handleClose}
        restaurantId={restaurantId}
        restaurantName={restaurantName}
      />
    </div>
  );
};

export default RestaurantEventsView;
