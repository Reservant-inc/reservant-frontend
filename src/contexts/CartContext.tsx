import React, { createContext, ReactNode, useState } from 'react';
import { CartItemType } from '../services/types';

interface CartContextProps {
  children: ReactNode;
}

interface CartContextValue {
  items: CartItemType[];
  addItemToCart: (item: CartItemType) => void;
  incrementItemQuantity: (menuItemId: number) => void;
  decrementItemQuantity: (menuItemId: number) => void;
}

export const CartContext = createContext<CartContextValue>({
  items: [],
  addItemToCart: () => {},
  incrementItemQuantity: () => {},
  decrementItemQuantity: () => {},
});

const CartContextProvider: React.FC<CartContextProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);

  const addToCart = (item: CartItemType) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.menuItemId === item.menuItemId);

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.menuItemId === item.menuItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const incrementQuantity = (menuItemId: number) => {
    setCart((prevCart) =>
      prevCart.map(cartItem =>
        cartItem.menuItemId === menuItemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const decrementQuantity = (menuItemId: number) => {
    setCart((prevCart) =>
      prevCart
        .map(cartItem =>
          cartItem.menuItemId === menuItemId && cartItem.quantity > 1
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter(cartItem => cartItem.quantity > 0)
    );
  };

  const ctxValue = {
    items: cart,
    addItemToCart: addToCart,
    incrementItemQuantity: incrementQuantity,
    decrementItemQuantity: decrementQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
