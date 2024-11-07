import React, { useContext } from 'react'
import MenuList from '../../restaurantManagement/menus/MenuList'
import { MenuScreenType } from '../../../services/enums'
import Cart from '../Cart'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../../contexts/CartContext'
import SellIcon from '@mui/icons-material/Sell'
import FriendSelector from '../../reusableComponents/FriendSelector'
import { ArrowForward } from '@mui/icons-material'
import { ReservationContext } from '../../../contexts/ReservationContext'

interface VisitProps {}

const Visit: React.FC<VisitProps> = () => {
  const navigate = useNavigate()

  const { items, totalPrice } = useContext(CartContext)

  const {
    friendsToAdd,
    setFriendsToAdd,
    setGuests,
    selectedTimeslot,
    setSelectedTimeslot,
    setDate,
    guests,
    restaurant,
    timeSlots,
    guestsErr,
    date,
    getParsedDate
  } = useContext(ReservationContext)

  const today = getParsedDate()

  const data = {
    restaurant: restaurant
  }
  return (
    <div className="relative flex h-full w-full gap-12 text-nowrap px-12 dark:border-t-[2px] dark:border-grey-4 dark:bg-black dark:text-grey-0">
      <div className="relative flex h-full w-1/4 min-w-[300px] flex-col gap-5 pt-7">
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
          <div className=" flex w-full flex-col gap-2 border-b-[1px] border-grey-1 py-2 text-sm">
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
              value={selectedTimeslot}
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
      </div>
      <div className=" flex h-full w-3/4 flex-col items-center gap-5 p-3">
        <div className="h-[calc(100%-3rem)] w-full">
          <MenuList
            activeRestaurantId={restaurant?.restaurantId}
            type={MenuScreenType.Order}
          />
        </div>
        <div className="flex h-8 w-full  flex-row-reverse gap-3">
          <button
            className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-sm text-primary enabled:hover:bg-primary enabled:hover:text-white disabled:border-grey-4 disabled:text-grey-4 dark:border-secondary dark:text-secondary enabled:dark:border-secondary enabled:dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black dark:disabled:border-grey-4 dark:disabled:text-grey-4"
            onClick={() => navigate('../checkout', { state: data })}
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

        <Cart />
      </div>
    </div>
  )
}

export default Visit
