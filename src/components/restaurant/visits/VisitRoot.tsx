import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import CartContextProvider from '../../../contexts/CartContext'
import ReservationContextProvider from '../../../contexts/ReservationContext'
import { RestaurantDetailsType } from '../../../services/types'

const VisitRoot: React.FC = () => {
  const { state } = useLocation()
  const { restaurant } = state as { restaurant: RestaurantDetailsType }
  const data = { restaurant: restaurant }
  return (
    <>
      <CartContextProvider>
        <ReservationContextProvider>
          <Outlet />
        </ReservationContextProvider>
      </CartContextProvider>
    </>
  )
}

export default VisitRoot
