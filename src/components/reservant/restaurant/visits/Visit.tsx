import React, { useContext, useEffect, useState } from 'react'
import MenuList from '../../restaurantManagement/menus/MenuList'
import { MenuScreenType } from '../../../../services/enums'
import Cart from '../Cart'
import { useLocation, useNavigate } from 'react-router-dom'
import { CartContext } from '../../../../contexts/CartContext'
import SellIcon from '@mui/icons-material/Sell'
import FriendSelector from '../../../reusableComponents/FriendSelector'
import { ArrowForward } from '@mui/icons-material'
import { ReservationContext } from '../../../../contexts/ReservationContext'
import { UserType } from '../../../../services/types'
import { fetchGET } from '../../../../services/APIconn'
import { FetchError } from '../../../../services/Errors'
import { useTranslation } from 'react-i18next'

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
  const navigate = useNavigate()

  const [t] = useTranslation('global')

  const today = getParsedDate()

  const { setReservationData, reservationData } = useContext(ReservationContext)

  const [guests, setGuests] = useState<number>(reservationData?.guests ?? 0)
  const [date, setDate] = useState<string>(
    reservationData ? reservationData.date : today
  )
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>(
    reservationData ? reservationData.selectedTimeslot : ''
  )
  const [friendsToAdd, setFriendsToAdd] = useState<UserType[]>(
    reservationData ? reservationData.friendsToAdd : []
  )
  const [disabledTimeSlots, setDisabledTimeSlots] = useState<string[]>([])
  const [availableHours, setAvailableHours] = useState<
    { from: string; until: string }[]
  >([])

  const [timeSlots, setTimeSlots] = useState<string[]>([])

  const { totalPrice, clearCart } = useContext(CartContext)

  const { state } = useLocation()

  const { restaurant } = state

  const data = {
    restaurant: restaurant
  }

  useEffect(() => {
    if (friendsToAdd.length >= guests) {
      setGuests(prevState => prevState + 1)
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
      const index = timeSlots.findIndex(
        ts =>
          ts === selectedTimeslot || ts === reservationData?.selectedTimeslot
      )
      setSelectedTimeslot(timeSlots[index >= 0 ? index : 0])
    } else {
      setSelectedTimeslot('')
    }
  }, [timeSlots])

  const fetchAvailableHours = async () => {
    try {
      const visitHours = await fetchGET(
        `/restaurants/${restaurant.restaurantId}/available-hours?date=${date}&numberOfGuests=${guests}`
      )
    // console.log(visitHours)
      setAvailableHours(visitHours)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('unexpected error', error)
      }
    }
  }

  const generateTimeSlots = () => {
    const slots: string[] = []
    const disabledSlots: string[] = []
    const now = new Date()
    const isToday = date === getParsedDate()

    const availableTimes = availableHours
      .map(({ from, until }) => ({
        from: parseTime(from),
        until: parseTime(until),
      }))
      .sort((a, b) => a.from.getTime() - b.from.getTime())

    availableTimes.forEach(({ from, until }) => {
      let currentTime = from

      while (currentTime < until) {
        if (!isToday || currentTime >= now) {
          slots.push(formatLocalTime(currentTime))
        }
        currentTime = new Date(currentTime.getTime() + 30 * 60000)
      }
    })

    const startOfDay = parseTime("00:00")
    const endOfDay = parseTime("23:59")
    let currentTime = startOfDay

    while (currentTime <= endOfDay) {
      const timeString = formatLocalTime(currentTime);
  
      if (!slots.includes(timeString)) {
        disabledSlots.push(timeString)
      }
  
      currentTime = new Date(currentTime.getTime() + 30 * 60000)
    }
  
    setTimeSlots(slots);
    setDisabledTimeSlots(disabledSlots);
  }

  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  const formatLocalTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, 
    }
    return date.toLocaleTimeString([], options)
  }

  return (
    <div className="relative flex h-full w-full gap-4 p-4 text-nowrap bg-grey-1 dark:border-t-[2px] dark:border-grey-4 dark:bg-grey-6 dark:text-grey-0">
      <div className="h-full w-3/4 items-center shadow-md flex flex-col items-center bg-white dark:bg-black rounded-lg p-3">
        <div className="h-[2rem] w-full">
          <h1 className="font-mont-bd text-lg text-center dark:text-white">
            Menu
          </h1>
        </div>
        <div className="h-[calc(100%-2rem)] w-full">
          <MenuList
            activeRestaurantId={restaurant.restaurantId}
            type={MenuScreenType.Order}
          />
        </div>
      </div>
      <div className=" flex h-full overflow-y-auto scroll rounded-lg shadow-md w-1/4 min-w-[360px] flex-col justify-between bg-white dark:bg-black items-center gap-5 p-3">
        <h1 className="text-lg font-mont-bd dark:text-white">
          {t('general.reservation')}
        </h1>
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex w-full flex-col justify-between gap-4">
            <div className="flex w-full justify-between">
              <label className="text-md  font-mont-md ">
                {t('reservation.guests-in-total')}:
              </label>
              <input
                type="number"
                value={guests}
                min={1 + friendsToAdd.length}
                onChange={e => {
                  setGuests(parseInt(e.target.value))
                }}
                className={`flex h-7 w-36 items-center rounded-md  border-[1px] border-grey-2 px-2 py-0 text-center dark:text-grey-0 text-black`}
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 border-b-[1px] border-grey-1 dark:border-grey-4 py-2 text-sm">
            <FriendSelector
              friendsToAdd={friendsToAdd}
              setFriendsToAdd={setFriendsToAdd}
              placeholder={t('reservation.registered-guests')}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <label className="text-md font-mont-md">
              {t('reservation.date')}:
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => setDate(e.target.value)}
              className="dark:[color-scheme:dark] flex h-7 w-36 items-center rounded-md border-[1px] border-grey-2 px-2 py-0 text-sm"
            />
          </div>
          <div className="flex h-full w-full items-center  justify-between gap-3 text-nowrap">
            <label className="font-mont-md">{t('reservation.time')}: </label>
              <select
                id="timeselect"
                onChange={(e) => {
                  const selectedLocalTime = e.target.value
                  setSelectedTimeslot(selectedLocalTime)
                }}
                value={selectedTimeslot}
                className="scroll ring-none flex h-7 w-36 items-center rounded-md border-[1px] border-grey-2 px-4 py-0 text-sm dark:bg-black dark:text-grey-0"
              >
                {timeSlots.length <= 0 && <option>{t('general.not-available')}</option>}
                {timeSlots
                  .filter((slot) => !disabledTimeSlots.includes(slot))
                  .map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        <Cart />

        <div className="flex h-8 w-full  flex-row-reverse gap-3">
          <button
            className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-sm text-primary enabled:hover:bg-primary enabled:hover:text-white disabled:border-grey-4 disabled:text-grey-4 dark:border-secondary dark:text-secondary enabled:dark:border-secondary enabled:dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black dark:disabled:border-grey-4 dark:disabled:text-grey-4"
            onClick={() => {
              clearCart()
              setReservationData({
                friendsToAdd: friendsToAdd,
                selectedTimeslot: selectedTimeslot,
                guests: guests,
                date: date
              })
              navigate('../checkout', { state: data })
            }}
            disabled={selectedTimeslot === '' || date === ''}
          >
            {t('reservation.skip-order')}
            <ArrowForward />
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-sm text-primary enabled:hover:bg-primary enabled:hover:text-white disabled:border-grey-4 disabled:text-grey-4 dark:border-secondary dark:text-secondary enabled:dark:border-secondary enabled:dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black dark:disabled:border-grey-4 dark:disabled:text-grey-4"
            onClick={() => {
              setReservationData({
                friendsToAdd: friendsToAdd,
                selectedTimeslot: selectedTimeslot,
                guests: guests,
                date: date
              })
              navigate('../checkout', { state: data })
            }}
            disabled={selectedTimeslot === '' || date === ''}
          >
            {`${t('reservation.checkout')} ${totalPrice > 0 ? totalPrice + 'zł' : ''}`}
            <SellIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Visit
