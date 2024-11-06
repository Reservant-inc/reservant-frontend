import React, { createContext, ReactNode, useState, useMemo } from 'react'
import { CartItemType } from '../services/types'

interface CartContextProps {
  children: ReactNode
}

interface CartContextValue {
  items: CartItemType[]
  addToCart: (item: CartItemType) => void
  incrementQuantity: (menuItemId: number) => void
  decrementQuantity: (menuItemId: number) => void
  totalPrice: number
}

export const CartContext = createContext<CartContextValue>({
  items: [],
  addToCart: () => {},
  incrementQuantity: () => {},
  decrementQuantity: () => {},
  totalPrice: 0
})

const CartContextProvider: React.FC<CartContextProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItemType[]>([])

  const addToCart = (item: CartItemType) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem.menuItemId === item.menuItemId
      )
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.menuItemId === item.menuItemId
            ? { ...cartItem, amount: cartItem.amount + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, amount: 1 }]
      }
    })
  }

  const incrementQuantity = (menuItemId: number) => {
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.menuItemId === menuItemId
          ? { ...cartItem, amount: cartItem.amount + 1 }
          : cartItem
      )
    )
  }

  const decrementQuantity = (menuItemId: number) => {
    setCart(prevCart =>
      prevCart
        .map(cartItem =>
          cartItem.menuItemId === menuItemId
            ? { ...cartItem, amount: cartItem.amount - 1 }
            : cartItem
        )
        .filter(cartItem => cartItem.amount > 0)
    )
  }

  const totalPrice = useMemo(() => {
    return cart.reduce((total, cartItem) => {
      return total + cartItem.price * cartItem.amount
    }, 0)
  }, [cart])

  const ctxValue = {
    items: cart,
    addToCart: addToCart,
    incrementQuantity: incrementQuantity,
    decrementQuantity: decrementQuantity,
    totalPrice
  }

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  )
}

export default CartContextProvider
