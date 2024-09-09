import React, { useState } from "react";
import RestaurantDetails from "./RestaurantDetails";
import { CartItem, MenuItem } from "../../../../services/interfaces";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Button } from "@mui/material";

interface RestaurantViewProps {
  id: number
  setIsRestaurantViewExtended: Function
}

const RestaurantView: React.FC<RestaurantViewProps> = ({ id, setIsRestaurantViewExtended }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.menuItemId === item.menuItemId,
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.menuItemId === item.menuItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const incrementQuantity = (menuItemId: number) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.menuItemId === menuItemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      ),
    );
  };

  const decrementQuantity = (menuItemId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.menuItemId === menuItemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0),
    );
  };

  return (
    <div className="relative w-full h-full overflow-y-auto scrol p-2 dark:bg-black">
      <div className="absolute right-2">
        <Button
          className={`flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-grey-1 text-black text-black dark:bg-grey-5`}
          onClick={() => setIsRestaurantViewExtended(false)}
        >
          <KeyboardBackspaceIcon className="h-5 w-5 dark:text-grey-1" />
        </Button>
      </div>
      <RestaurantDetails restaurantId={id} />
    </div>
  );
};

export default RestaurantView;
