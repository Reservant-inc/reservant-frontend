import React from 'react'
import { Outlet } from 'react-router-dom'
import CartContextProvider from '../../../../contexts/CartContext'
import ReservationContextProvider from '../../../../contexts/ReservationContext'
import { SnackbarProvider } from '../../../../contexts/SnackbarContext'

const VisitRoot: React.FC = () => {
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
