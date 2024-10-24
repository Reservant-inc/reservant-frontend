import React, { createContext, ReactNode, useState, useMemo } from 'react';
import { CartItemType } from '../services/types';

interface CartContextProps {
  children: ReactNode;
}

interface CartContextValue {
  items: CartItemType[];
  addItemToCart: (item: CartItemType) => void;
  incrementItemQuantity: (menuItemId: number) => void;
  decrementItemQuantity: (menuItemId: number) => void;
  totalPrice: number;
}

export const CartContext = createContext<CartContextValue>({
  items: [],
  addItemToCart: () => {},
  incrementItemQuantity: () => {},
  decrementItemQuantity: () => {},
  totalPrice: 0
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
          cartItem.menuItemId === menuItemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 } 
          : cartItem
        )
        .filter(cartItem => cartItem.quantity > 0)
    );
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((total, cartItem) => {
      return total + cartItem.price * cartItem.quantity;
    }, 0);
  }, [cart])

  const ctxValue = {
    items: cart,
    addItemToCart: addToCart,
    incrementItemQuantity: incrementQuantity,
    decrementItemQuantity: decrementQuantity,
    totalPrice
  };

  return (
    <CartContext.Provider value={ctxValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
