import React, { useState, useMemo } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartItemType } from "../../../../../services/types";

interface RestaurantCartViewProps {
  cart: CartItemType[];
  incrementQuantity: (menuItemId: number) => void;
  decrementQuantity: (menuItemId: number) => void;
}

const RestaurantCartView: React.FC<RestaurantCartViewProps> = React.memo(
  ({ cart, incrementQuantity, decrementQuantity }) => {
    const [note, setNote] = useState<string>("");
    const [promoCode, setPromoCode] = useState<string>("");

    const totalAmount = useMemo(() => {
      return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    }, [cart]);

    return (
      <Box className="flex flex-col items-center space-y-4 p-4">
        <Typography variant="h4">Mój koszyk</Typography>
        {cart.length === 0 ? (
          <Typography variant="body1">
            Twój koszyk jest pusty. Dodaj coś!
          </Typography>
        ) : (
          cart.map((item) => (
            <Box
              key={item.menuItemId}
              className="my-2 flex w-full max-w-md justify-between rounded border p-4"
            >
              <Box>
                <Typography variant="h6">{item.name}</Typography>
                <Typography>
                  {item.price} zł x {item.quantity}
                </Typography>
                <Typography>
                  Łącznie: {item.price * item.quantity} zł
                </Typography>
              </Box>
              <Box className="flex items-center">
                <Typography>Ilość: {item.quantity}</Typography>
                <IconButton
                  onClick={() => decrementQuantity(item.menuItemId)}
                  sx={{
                    bgcolor: "#a94c79",
                    color: "#fefefe",
                    height: 30,
                    width: 30,
                    ml: 2,
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  onClick={() => incrementQuantity(item.menuItemId)}
                  sx={{
                    bgcolor: "#a94c79",
                    color: "#fefefe",
                    height: 30,
                    width: 30,
                    ml: 2,
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        )}

        <Typography variant="body1" className="mt-4">
          Napisz notatkę do zamówienia... (opcjonalnie)
        </Typography>

        <TextField
          rows={6}
          multiline={true}
          placeholder="Twoja notatka"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: "100%", maxWidth: 600 }}
        />

        <Typography variant="body1" className="mt-4">
          Dodaj kod promocyjny
        </Typography>
        <TextField
          placeholder="Kod promocyjny"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          style={{ width: "100%", maxWidth: 600 }}
        />

        <Box className="mt-4 flex w-full max-w-md justify-between">
          <Typography variant="h6">Kwota całkowita</Typography>
          <Typography variant="h6">{totalAmount} zł</Typography>
        </Box>

        <Button
          variant="contained"
          sx={{ bgcolor: "#a94c79", color: "#fefefe", mt: 4 }}
        >
          Przejdź do podsumowania
        </Button>
      </Box>
    );
  },
);

export default RestaurantCartView;
