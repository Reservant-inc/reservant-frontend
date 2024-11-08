import React, { ReactNode, useState, createContext } from 'react'
import { ReservationType } from '../services/types'

interface ReservationContextProps {
  children: ReactNode
}

interface ReservationContextValue {
  reservationData: ReservationType | null
  setReservationData: Function
}

export const ReservationContext = createContext<ReservationContextValue>({
  reservationData: null,
  setReservationData: () => {}
})

const ReservationContextProvider: React.FC<ReservationContextProps> = ({
  children
}) => {
  const [reservationData, setReservationData] =
    useState<ReservationType | null>(null)

  const value = {
    reservationData,
    setReservationData
  }

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  )
}

export default ReservationContextProvider
