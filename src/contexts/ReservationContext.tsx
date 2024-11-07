import React, { ReactNode, useState, useMemo, createContext } from 'react'
import {
  CartItemType,
  RestaurantDetailsType,
  UserType
} from '../services/types'

interface ReservationContextProps {
  children: ReactNode
}

interface ReservationContextValue {
  friendsToAdd: UserType[]
  guests: number
  date: string
  setDate: Function
  setFriendsToAdd: Function
  setGuests: Function
  getParsedDate: () => string
  setSelectedTimeslot: Function
  selectedTimeslot: string
}

export const ReservationContext = createContext<ReservationContextValue>({
  friendsToAdd: [],
  setFriendsToAdd: () => {},
  setSelectedTimeslot: () => {},
  selectedTimeslot: '',
  guests: 0,
  setGuests: () => {},
  date: '',
  setDate: () => {},
  getParsedDate: () => ''
})

const ReservationContextProvider: React.FC<ReservationContextProps> = ({
  children
}) => {
  const getParsedDate = (): string => {
    const today = new Date()
    return (
      today.getFullYear() +
      '-' +
      String(today.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(today.getDate()).padStart(2, '0')
    )
  }

  const [guests, setGuests] = useState<number>(1)
  const [date, setDate] = useState<string>(getParsedDate())
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>('')

  const [friendsToAdd, setFriendsToAdd] = useState<UserType[]>([])

  const value = {
    selectedTimeslot: selectedTimeslot,
    setSelectedTimeslot,
    friendsToAdd: friendsToAdd,
    setFriendsToAdd: setFriendsToAdd,
    guests: guests,
    setGuests: setGuests,
    date: date,
    setDate: setDate,
    getParsedDate: getParsedDate
  }

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  )
}

export default ReservationContextProvider
