import React, { useContext, useEffect, useState } from 'react'
import { RestaurantDetailsType, UserType } from '../../../services/types'
import MenuList from '../../restaurantManagement/menus/MenuList'
import { MenuScreenType } from '../../../services/enums'
import Cart from '../Cart'
import { fetchGET } from '../../../services/APIconn'
import { FetchError } from '../../../services/Errors'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CartContext } from '../../../contexts/CartContext'
import SellIcon from '@mui/icons-material/Sell'
import FriendSelector from '../../reusableComponents/FriendSelector'
import { ArrowForward, ChevronRight, SkipNext } from '@mui/icons-material'

interface VisitProps {}

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

const Visit: React.FC<VisitProps> = () => {
  const today = getParsedDate()

  const { state } = useLocation()
  const { restaurant } = state as { restaurant: RestaurantDetailsType }

  const [guests, setGuests] = useState<number>(1)
  const [date, setDate] = useState<string>(today)
  const [availableHours, setAvailableHours] = useState<
    { from: string; until: string }[]
  >([])
  const [timeSlots, setTimeSlots] = useState<string[]>([])

  const navigate = useNavigate()
  const { items, totalPrice } = useContext(CartContext)
  const [friendsToAdd, setFriendsToAdd] = useState<UserType[]>([])
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>('')

  const parseDateTime = (date: string, timeSlot: string): Date => {
    const [time, ampm] = timeSlot.split(' ')
    const [hours, minutes] = time.split(':').map(Number)

    const formattedHours = ampm === 'PM' && hours !== 12 ? hours + 12 : hours
    return new Date(
      `${date}T${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
    )
  }

  const data = {
    items: items,
    totalPrice: totalPrice,
    date: parseDateTime(date, selectedTimeslot),
    guests: guests,
    friendsToAdd: friendsToAdd,
    restaurant: restaurant
  }

  const skipData = {
    date: parseDateTime(date, selectedTimeslot),
    guests: guests,
    friendsToAdd: friendsToAdd,
    restaurant: restaurant
  }

  useEffect(() => {
    if (date && guests) {
      fetchAvailableHours()
    }
  }, [date, guests])

  useEffect(() => {
    if (friendsToAdd.length >= guests) {
      setGuests(guests + 1)
    }
  }, [friendsToAdd])

  useEffect(() => {
    if (availableHours.length > 0) {
      generateTimeSlots()
    } else {
      setTimeSlots([])
    }
  }, [availableHours])

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

    console.log(availableHours)

    availableHours.forEach(({ from, until }) => {
      console.log(from)

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

  return (
    <div className="relative flex h-full w-full gap-12 text-nowrap px-12">
      <div className="relative flex h-full w-1/4 flex-col gap-5 pt-7">
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full items-center justify-between gap-4">
            <label className="text-md font-mont-md">Guests in total:</label>
            <input
              type="number"
              value={guests}
              min={1 + friendsToAdd.length}
              onChange={e => setGuests(parseInt(e.target.value))}
              className="flex h-7 w-36 items-center  rounded-md border-[1px] border-grey-2 px-2 py-0 text-center"
            />
          </div>
          <div className=" flex w-full flex-col gap-2 border-b-[1px] border-grey-1 py-2 text-sm">
            <h1 className="pl-2">
              Some of your guests have an account?
              <br />
              Tag them!
            </h1>
            <FriendSelector
              friendsToAdd={friendsToAdd}
              setFriendsToAdd={setFriendsToAdd}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <label className="text-md font-mont-md">Date:</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => setDate(e.target.value)}
              className="flex h-7 w-36 items-center  rounded-md border-[1px] border-grey-2 px-2 py-0"
            />
          </div>
          <div className="flex h-full w-full items-center  justify-between gap-3 text-nowrap">
            <label className="font-mont-md">Time: </label>
            {timeSlots.length > 0 ? (
              <select
                onChange={e => setSelectedTimeslot(e.target.value)}
                className="scroll ring-none flex h-7 w-36 items-center rounded-md border-[1px] border-grey-2 px-4  py-0 text-sm"
              >
                <option className="hover:bg-grey-1">Time</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot} className="hover:bg-grey-1">
                    {slot}
                  </option>
                ))}
              </select>
            ) : (
              <h1>No avaliable hours</h1>
            )}
          </div>
        </div>
      </div>
      <div className=" flex h-full w-3/4 flex-col items-center gap-5 p-3">
        <div className="h-[calc(100%-3rem)] w-full">
          <MenuList
            activeRestaurantId={restaurant.restaurantId}
            type={MenuScreenType.Order}
          />
        </div>
        <div className="flex h-8 w-full flex-row-reverse gap-3">
          <button
            className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            onClick={() => navigate('../checkout', { state: skipData })}
          >
            {`SKIP ORDER`}
            <ArrowForward />
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            onClick={() => navigate('../checkout', { state: data })}
          >
            {`CHECKOUT ${totalPrice > 0 ? totalPrice + 'zł' : ''}`}
            <SellIcon />
          </button>
        </div>

        <Cart />
      </div>
    </div>
  )
}

export default Visit
