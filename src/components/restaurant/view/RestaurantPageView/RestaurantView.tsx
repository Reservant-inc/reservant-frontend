import React, { useState } from "react";
import RestaurantDetails from "./RestaurantDetails";
import { CartItemType, MenuItemType} from '../../../../services/types'

interface RestaurantViewProps {
  id: string
}

const RestaurantView: React.FC<RestaurantViewProps> = ({ id }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);

  console.log(id)

  const addToCart = (item: MenuItemType) => {
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
    <div className="flex w-full h-full flex-col lg:flex-row overflow-y-auto scroll">
      <div className="w-full lg:w-2/3">
        <RestaurantDetails restaurantId={id} />
      </div>
    </div>
  );
};

export default RestaurantView;
