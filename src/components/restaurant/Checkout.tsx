import React, { useContext, useEffect } from 'react'
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

  const onSubmit = async () => {
    let res
    try {
      const body = JSON.stringify({
        date: date,
        endTime: new Date(new Date(date).getTime() + 300 * 60000).toJSON(),
        numberOfGuests: guests - getParticipantsIds.length,
        tip: 0,
        takeaway: false,
        restaurantId: restaurant.restaurantId,
        participantIds: getParticipantsIds()
      })
      console.log(body)
      res = await fetchPOST(`/visits`, body)
      alert('visit created')
    } catch (error) {
      if (error instanceof FetchError) console.log(error.formatErrors())
      else console.log('Unexpected error', error)
    }
    if (items && items?.length > 0 && res) {
      try {
        const body = JSON.stringify({
          visitId: res.visitId,
          note: '',
          items: items
        })
        await fetchPOST(`/visits`, body)
        alert('order created')
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
    <div className="checkout-container flex h-full w-full flex-col items-center gap-7 p-10 dark:bg-black dark:text-grey-0">
      <div className="flex h-full w-full justify-center gap-14">
        <div className="flex h-full w-1/3 flex-col gap-10">
          <div className="flex h-2/6 w-full flex-col gap-3 rounded-lg border-[1px] border-grey-1 p-5">
            <h1 className="self-center font-mont-bd text-xl ">User details</h1>
            <span className="flex justify-between">
              <label>First name:</label>
              <label>{user.firstName}</label>
            </span>
            <span className="flex justify-between">
              <label>Last name:</label>
              <label>{user.lastName}</label>
            </span>
          </div>
          <div className="flex h-3/6 w-full flex-col gap-3 rounded-lg border-[1px] border-grey-1 p-5">
            <h1 className="self-center font-mont-bd text-xl ">
              Reservation details
            </h1>
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
          <button
            className="h-1/6 self-center rounded-lg border-[1px] border-grey-1 px-7 shadow-lg hover:text-primary"
            onClick={onSubmit}
          >
            {' '}
            Proceed to payment
          </button>
        </div>
        {items?.length > 0 && (
          <div className="flex h-full w-1/3 flex-col gap-10">
            <div className="flex h-2/3 flex-col rounded-lg border-[1px] border-grey-1 p-5">
              <h1 className="self-center font-mont-bd text-xl ">
                Order details
              </h1>
              <div className="separator flex w-full flex-col gap-4 divide-y-[1px] ">
                {items.map(item => (
                  <div
                    key={item.menuItemId}
                    className=" flex items-center gap-4 p-4 "
                  >
                    <img
                      src={getImage(item.photo, DefaultImage)}
                      alt={item.name}
                      className="h-[50px] w-[50px] rounded-sm"
                    />
                    <div className="flex flex-col">
                      <h1 className="text-lg font-bold">{item.name}</h1>
                      <h2>{item.price} zł</h2>
                      <h3>Quantity: {item.quantity}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex h-1/3 flex-col gap-7 rounded-lg border-[1px] border-grey-1 p-5">
              <h1 className="self-center font-mont-bd text-xl ">
                Additional notes
              </h1>
              <input />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout
