import React, { useState } from "react";
import RestaurantDetails from "./RestaurantDetails";
import RestaurantCart from "./RestaurantCart";
import { CartItem, MenuItem } from "../../../../services/interfaces";
import { useParams } from "react-router-dom";

const RestaurantView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const incrementQuantity = (itemId: number) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      ),
    );
  };

  const decrementQuantity = (itemId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0),
    );
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="w-full lg:w-2/3">
        <RestaurantDetails addToCart={addToCart} restaurantId={id} />
      </div>
      <div className="mt-10 flex h-full min-h-screen w-full items-start justify-center lg:mt-20 lg:w-1/3">
        <RestaurantCart
          cart={cart}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
        />
      </div>
    </div>
  );
};

export default RestaurantView;
