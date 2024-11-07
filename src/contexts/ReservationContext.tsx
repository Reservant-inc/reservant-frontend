import React, { ReactNode, useState, createContext, useEffect } from 'react'
import { RestaurantDetailsType, UserType } from '../services/types'
import { fetchGET } from '../services/APIconn'
import { FetchError } from '../services/Errors'
import { useLocation } from 'react-router-dom'

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

  restaurant: null | RestaurantDetailsType
  timeSlots: string[]
  guestsErr: string | null
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
  getParsedDate: () => '',
  restaurant: null,
  timeSlots: [],
  guestsErr: ''
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
  const [guestsErr, setGuestsErr] = useState<string | null>(null)
  const { state } = useLocation()

  const { restaurant } = state as { restaurant: RestaurantDetailsType }
  const data = { restaurant: restaurant }

  const [availableHours, setAvailableHours] = useState<
    { from: string; until: string }[]
  >([])

  const [timeSlots, setTimeSlots] = useState<string[]>([])

  useEffect(() => {
    if (friendsToAdd.length >= guests) {
      setGuests(prevState => prevState + 1)
    }
    if (guests < friendsToAdd.length + 1 || !guests) {
      setGuestsErr('invalid number')
    } else {
      setGuestsErr(null)
    }
  }, [guests, friendsToAdd])

  useEffect(() => {
    if (date && guests) {
      fetchAvailableHours()
    }
  }, [date, guests])

  useEffect(() => {
    if (availableHours.length > 0) {
      generateTimeSlots()
    } else {
      setTimeSlots([])
    }
  }, [availableHours])

  useEffect(() => {
    if (timeSlots.length > 0) {
      const index = timeSlots.findIndex(ts => ts === selectedTimeslot) ?? 0
      setSelectedTimeslot(timeSlots[index])
    } else {
      setSelectedTimeslot('')
    }
  }, [timeSlots])

  const fetchAvailableHours = async () => {
    try {
      const visitHours = await fetchGET(
        `/restaurants/${restaurant.restaurantId}/available-hours?date=${date}&numberOfGuests=${guests}`
      )

      setAvailableHours(visitHours)
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('unexpected error', error)
      }
    }
  }

  const generateTimeSlots = () => {
    const slots: string[] = []
    const now = new Date()
    const isToday = date === getParsedDate()

    availableHours.forEach(({ from, until }) => {
      let currentTime = parseTime(from)
      const endTime = parseTime(until)

      while (currentTime <= endTime) {
        if (!isToday || currentTime >= now) {
          slots.push(formatTime(currentTime))
        }
        currentTime = new Date(currentTime.getTime() + 30 * 60000)
      }
    })

    setTimeSlots(slots)
  }

  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  const formatTime = (date: Date): string => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${formattedHours}:${formattedMinutes} ${ampm}`
  }

  const value = {
    selectedTimeslot: selectedTimeslot,
    setSelectedTimeslot,
    friendsToAdd: friendsToAdd,
    setFriendsToAdd: setFriendsToAdd,
    guests: guests,
    setGuests: setGuests,
    date: date,
    setDate: setDate,
    getParsedDate: getParsedDate,
    restaurant: restaurant,
    timeSlots: timeSlots,
    guestsErr: guestsErr
  }

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  )
}

export default ReservationContextProvider
