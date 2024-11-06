import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  CartItemType,
  RestaurantDetailsType,
  UserType
} from '../../services/types'
import { fetchPOST, getImage } from '../../services/APIconn'
import DefaultImage from '../../assets/images/defaulImage.jpeg'
import Cookies from 'js-cookie'
import { FetchError } from '../../services/Errors'
import { forEach } from 'lodash'

const Checkout: React.FC = () => {
  const { state } = useLocation()
  const { items, totalPrice, guests, date, friendsToAdd, restaurant } =
    state as {
      friendsToAdd: UserType[]
      items: CartItemType[]
      totalPrice: number
      guests: number
      date: Date
      restaurant: RestaurantDetailsType
    }
  const userInfo = Cookies.get('userInfo')
  const user = userInfo ? JSON.parse(userInfo) : null
  const [note, setNote] = useState<string>('')

  const wallet = 50
  const canAfford =
    wallet >=
    (restaurant.reservationDeposit
      ? restaurant.reservationDeposit
      : 0 + totalPrice
        ? totalPrice
        : 0)

  const onSubmit = async () => {
    let res
    try {
      const body = JSON.stringify({
        date: date,
        endTime: new Date(new Date(date).getTime() + 30 * 60000).toJSON(),
        numberOfGuests: guests - getParticipantsIds.length,
        tip: 0,
        takeaway: false,
        restaurantId: restaurant.restaurantId,
        participantIds: getParticipantsIds()
      })
      console.log(body)
      res = await fetchPOST(`/visits`, body)
      alert('visit created')
      console.log('visit created')
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
        alert(error.formatErrors())
      } else console.log('Unexpected error', error)
    }
    if (items && items?.length > 0 && res) {
      try {
        const body = JSON.stringify({
          visitId: res.visitId,
          note: note.length > 0 ? note : 'lalallalal',
          items: items
        })
        await fetchPOST(`/orders`, body)
        alert('order created')
        console.log('order created')
      } catch (error) {
        if (error instanceof FetchError) console.log(error.formatErrors())
        else console.log('Unexpected error')
      }
    }
  }

  const getParticipantsIds = () => {
    let res: string[] = []
    for (let friend of friendsToAdd) {
      res.push(friend.userId)
    }
    res.push(user.userId)
    return res
  }

  const formatDateTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 text-sm dark:bg-grey-6 dark:text-grey-0">
      <div className="flex h-[90%] w-full items-center justify-center gap-12">
        <div className="flex h-full w-1/2 flex-col items-end justify-center gap-4">
          <div className="flex h-1/4 w-1/2 flex-col gap-2 rounded-lg   bg-grey-0 p-5 dark:bg-black ">
            <h1 className="self-center font-mont-bd text-xl ">User details</h1>
            <div className="separator flex flex-col gap-2 divide-y-[1px] divide-grey-2  ">
              <span className="flex justify-between">
                <label>First name:</label>
                <label>{user.firstName}</label>
              </span>
              <span className="flex justify-between">
                <label>Last name:</label>
                <label>{user.lastName}</label>
              </span>
            </div>
          </div>
          <div className="flex h-1/4 w-1/2 flex-col gap-2 rounded-lg bg-grey-0 p-5 dark:bg-black ">
            <h1 className="self-center font-mont-bd text-xl ">
              Select payment method
            </h1>
            <div className="flex flex-col gap-2">
              <div className="flex w-full items-center gap-3  ">
                <input
                  type="radio"
                  name="paymentMethod"
                  defaultChecked={canAfford}
                  disabled={!canAfford}
                  className=" h-5 w-5 cursor-pointer border-[1px] border-grey-2 text-grey-3 checked:text-primary disabled:cursor-default dark:checked:text-secondary"
                />
                <span
                  className={`${canAfford ? 'text-black dark:text-grey-0' : 'text-grey-3 dark:text-grey-3'}`}
                >
                  {`
                  Wallet ${wallet} zł 
                  ${canAfford ? '' : ' - insufficient founds'}`}
                </span>
              </div>

              <div className="flex w-full  items-center gap-3 ">
                <input
                  type="radio"
                  name="paymentMethod"
                  defaultChecked={true}
                  className=" h-5 w-5 cursor-pointer border-[1px] border-grey-2 text-grey-3 checked:text-primary dark:checked:text-secondary"
                />
                <span className="">Card</span>
              </div>
            </div>
          </div>
          {items?.length > 0 && (
            <div className="flex h-1/2 w-1/2 flex-col gap-3 rounded-lg bg-grey-0 p-5 dark:bg-black">
              <h1 className="self-center font-mont-bd text-xl ">
                Additional notes
              </h1>
              <div className="h-full w-full ">
                <textarea
                  className=" h-full w-full resize-none rounded-lg border-grey-1  dark:border-grey-6 dark:bg-black dark:bg-grey-5"
                  onChange={e => setNote(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex h-full w-1/2 flex-col items-start justify-center gap-4">
          <div className=" flex h-1/2 w-1/2 flex-col gap-2 rounded-lg bg-grey-0 p-5 dark:bg-black">
            <h1 className="self-center font-mont-bd text-xl ">
              Reservation details
            </h1>
            <div className="separator flex flex-col gap-2 divide-y-[1px] divide-grey-2">
              <span className="flex justify-between">
                <label>Total number of guests:</label>
                <label>{guests}</label>
              </span>
              <span className="flex justify-between">
                <label>Date of reservation:</label>
                <label>{formatDateTime(date)}</label>
              </span>
              <span className="flex justify-between">
                <label>Reservation duration:</label>
                <label>{'30' + ' ' + 'min'}</label>
              </span>
              <span className="flex justify-between">
                <label>Reservation deposit:</label>
                <label>
                  {restaurant.reservationDeposit
                    ? restaurant.reservationDeposit
                    : 0}{' '}
                  zł
                </label>
              </span>
              <span className="flex justify-between">
                <label>Order cost:</label>
                <label>{totalPrice ? totalPrice : 0} zł</label>
              </span>
              <span className="flex justify-between">
                <label>Total cost:</label>
                <label>
                  {restaurant.reservationDeposit
                    ? restaurant.reservationDeposit
                    : 0 + totalPrice
                      ? totalPrice
                      : 0}{' '}
                  zł
                </label>
              </span>
            </div>
          </div>

          {items?.length > 0 && (
            <div className="flex h-1/2 w-1/2 flex-col  gap-1 rounded-lg  bg-grey-0 p-5 dark:bg-black">
              <h1 className="self-center font-mont-bd text-xl ">
                Order details
              </h1>
              <div className="separator scroll flex w-full flex-col gap-1 divide-y-[1px] divide-grey-2  overflow-auto pr-3 ">
                {items.map(item => (
                  <div
                    key={item.menuItemId}
                    className=" flex items-center gap-4 p-4 "
                  >
                    <img
                      src={getImage(item.photo, DefaultImage)}
                      alt={item.name}
                      className="h-[50px] w-[50px] rounded-lg"
                    />
                    <div className="flex flex-col">
                      <h1 className="text-lg font-bold">{item.name}</h1>
                      <h2>{item.price} zł</h2>
                      <h3>Quantity: {item.amount}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        className="flex w-fit items-center justify-center gap-2 self-center rounded-md border-[1px] border-primary px-3 py-1 text-primary enabled:hover:bg-primary enabled:hover:text-white dark:border-secondary dark:text-secondary enabled:dark:border-secondary enabled:dark:text-secondary enabled:dark:hover:bg-secondary enabled:dark:hover:text-black"
        onClick={onSubmit}
      >
        Proceed to payment
      </button>
    </div>
  )
}

export default Checkout
