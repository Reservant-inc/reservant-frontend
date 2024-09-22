import React, { useState, useMemo } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartItemType } from "../../../../../services/types";
import { useTranslation } from "react-i18next";

interface RestaurantCartViewProps {
  cart: CartItemType[];
  incrementQuantity: (menuItemId: number) => void;
  decrementQuantity: (menuItemId: number) => void;
}

const RestaurantCartView: React.FC<RestaurantCartViewProps> = React.memo(
  ({ cart, incrementQuantity, decrementQuantity }) => {
    const [note, setNote] = useState<string>("");
    const [promoCode, setPromoCode] = useState<string>("");
    const { t } = useTranslation("global");

    const totalAmount = useMemo(() => {
      return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    }, [cart]);

    return (
      <Box className="flex flex-col items-center space-y-4 p-4">
        <Typography variant="h4">{t('cart.my-basket')}</Typography>
        {cart.length === 0 ? (
          <Typography variant="body1">
            {t('cart.empty-basket')}!
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
                  {t('cart.total-cost')}: {item.price * item.quantity} zł
                </Typography>
              </Box>
              <Box className="flex items-center">
                <Typography>{t('cart.quantity')}: {item.quantity}</Typography>
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
          {t("cart.note")}
        </Typography>

        <TextField
          rows={6}
          multiline={true}
          placeholder={t("cart.your-note")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: "100%", maxWidth: 600 }}
        />

        <Typography variant="body1" className="mt-4">
          {t('cart.add-promo-code')}
        </Typography>
        <TextField
          placeholder={t('cart.promo-code')}
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          style={{ width: "100%", maxWidth: 600 }}
        />

        <Box className="mt-4 flex w-full max-w-md justify-between">
          <Typography variant="h6">{t('cart.total-cost')}</Typography>
          <Typography variant="h6">{totalAmount} zł</Typography>
        </Box>

        <Button
          variant="contained"
          sx={{ bgcolor: "#a94c79", color: "#fefefe", mt: 4 }}
        >
          {t('cart.go-to-summary')}
        </Button>
      </Box>
    );
  },
);

export default RestaurantCartView;
