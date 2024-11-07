import React, { useContext, useEffect, useState } from 'react'
import { RestaurantDetailsType, UserType } from '../../../services/types'
import MenuList from '../../restaurantManagement/menus/MenuList'
import { MenuScreenType } from '../../../services/enums'
import Cart from '../Cart'
import { fetchGET } from '../../../services/APIconn'
import { FetchError } from '../../../services/Errors'
import { useLocation, useNavigate } from 'react-router-dom'
import { CartContext } from '../../../contexts/CartContext'
import SellIcon from '@mui/icons-material/Sell'
import FriendSelector from '../../reusableComponents/FriendSelector'
import { ArrowForward } from '@mui/icons-material'

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
  const [availableHours, setAvailableHours] = useState<{ from: string; until: string }[]>([])
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const { items, totalPrice } = useContext(CartContext)
  const [friendsToAdd, setFriendsToAdd] = useState<UserType[]>([])
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>('')
  const [guestsErr, setGuestsErr] = useState<string | null>(null)
  
  const navigate = useNavigate()
  
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
    if (guests < friendsToAdd.length + 1 || !guests) {
      setGuestsErr('invalid number')
    } else {
      setGuestsErr(null)
    }
  }, [guests])

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

  useEffect(() => {
    if (timeSlots.length > 0) {
      let tmp: HTMLSelectElement = document.getElementById(
        'timeselect'
      ) as HTMLSelectElement
      tmp.selectedIndex = 0
      setSelectedTimeslot(tmp.value)
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

  return (
    <div className="relative flex h-full w-full gap-12 p-4 text-nowrap bg-grey-1 dark:border-t-[2px] dark:border-grey-4 dark:bg-black dark:text-grey-0">
      <div className="h-full w-3/4 items-center shadow-md">
        <MenuList
          activeRestaurantId={restaurant.restaurantId}
          type={MenuScreenType.Order}
        />
        <Cart 
        />
      </div>
      <div className="flex h-full w-1/4 min-w-[300px] flex-col justify-between bg-white rounded-lg p-3 shadow-md">
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex w-full flex-col justify-between gap-4">
            <div className="flex w-full justify-between">
              <label className="text-md  font-mont-md ">Guests in total:</label>
              <input
                type="number"
                value={guests}
                min={1 + friendsToAdd.length}
                onChange={e => {
                  setGuests(parseInt(e.target.value))
                }}
                className={`flex h-7 w-36 items-center rounded-md  border-[1px] border-grey-2 px-2 py-0 text-center dark:text-grey-0 ${guestsErr ? 'text-error' : 'text-black'}`}
              />
            </div>

            {guestsErr && <h1 className="text-error">{guestsErr}</h1>}
          </div>
          <div className="flex w-full flex-col gap-2 border-b-[1px] border-grey-1 py-2 text-sm">
            <FriendSelector
              friendsToAdd={friendsToAdd}
              setFriendsToAdd={setFriendsToAdd}
              placeholder="Some of your guests have an account? Tag them!"
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <label className="text-md font-mont-md">Date:</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => setDate(e.target.value)}
              className=" flex h-7 w-36 items-center rounded-md border-[1px] border-grey-2 px-2 py-0 text-sm"
            />
          </div>
          <div className="flex h-full w-full items-center  justify-between gap-3 text-nowrap">
            <label className="font-mont-md">Time: </label>
            <select
              id="timeselect"
              onChange={e => setSelectedTimeslot(e.target.value)}
              className="scroll ring-none flex h-7 w-36 items-center rounded-md border-[1px] border-grey-2 px-4 py-0 text-sm  dark:bg-black dark:text-grey-0"
            >
              {timeSlots.length <= 0 && <option>Not avaliable</option>}
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot} className="hover:bg-grey-1">
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex h-8 w-full  flex-row-reverse gap-3">
          <button
            className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-sm text-primary enabled:hover:bg-primary enabled:hover:text-white disabled:border-grey-4 disabled:text-grey-4 dark:border-secondary dark:text-secondary enabled:dark:border-secondary enabled:dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black dark:disabled:border-grey-4 dark:disabled:text-grey-4"
            onClick={() => navigate('../checkout', { state: skipData })}
            disabled={selectedTimeslot === '' || guestsErr !== null}
          >
            {`SKIP ORDER`}
            <ArrowForward />
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-sm text-primary enabled:hover:bg-primary enabled:hover:text-white disabled:border-grey-4 disabled:text-grey-4 dark:border-secondary dark:text-secondary enabled:dark:border-secondary enabled:dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black dark:disabled:border-grey-4 dark:disabled:text-grey-4"
            onClick={() => navigate('../checkout', { state: data })}
            disabled={selectedTimeslot === '' || guestsErr !== null}
          >
            {`CHECKOUT ${totalPrice > 0 ? totalPrice + 'zł' : ''}`}
            <SellIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Visit
