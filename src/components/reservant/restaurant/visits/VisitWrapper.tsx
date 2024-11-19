import React from 'react'
import { Outlet } from 'react-router-dom'
import CartContextProvider from '../../../../contexts/CartContext'

const VisitWrapper: React.FC = () => {
  return (
    <>
      <CartContextProvider>
        <Outlet />
      </CartContextProvider>
    </>
  )
}

export default VisitWrapper
