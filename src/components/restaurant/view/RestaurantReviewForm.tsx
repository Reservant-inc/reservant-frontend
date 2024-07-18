import React, { useState } from "react";
import {
  Box,
  Button,
  Rating,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { fetchPOST } from "../../../services/APIconn";

interface RestaurantReviewFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const RestaurantReviewForm: React.FC<RestaurantReviewFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const [stars, setStars] = useState<number | null>(0);
  const [contents, setContents] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    const review = {
      stars: stars,
      contents: contents,
    };

    try {
      const response = await fetchPOST(
        "/restaurants/2/reviews",
        JSON.stringify(review),
      );
      if (response) {
        setSuccessMessage("Opinia została dodana pomyślnie!");
        onSuccess();
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 2000);
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      if (error instanceof Error) {
        try {
          //nwm czemu to nie dziala ale sie dowiem
          const errorData = JSON.parse(error.message);
          if (errorData.errorCodes?.[""]?.includes("Duplicate")) {
            setErrorMessage("Już wystawiłeś opinię dla tego lokalu!");
          } else {
            setErrorMessage("Błąd podczas wysyłania opinii");
          }
        } catch (e) {
          setErrorMessage("Błąd podczas wysyłania opinii");
        }
      } else {
        setErrorMessage("Błąd podczas wysyłania opinii");
      }
    }
  };

  const handleCloseSnackbar = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h6">Dodaj opinię</Typography>
      <Rating
        name="review-rating"
        value={stars}
        onChange={(event, newValue) => {
          setStars(newValue);
        }}
        precision={1} // only full numbers
      />
      <TextField
        id="outlined-multiline-static"
        label="Opis"
        multiline
        rows={4}
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />
      <Button
        variant="contained"
        style={{ backgroundColor: "#a94c79", color: "#fefefe" }}
        onClick={handleSubmit}
      >
        Dodaj opinię
      </Button>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ top: "60%" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ top: "60%" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RestaurantReviewForm;
