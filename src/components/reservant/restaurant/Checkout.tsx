import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchGET, fetchPOST, getImage } from '../../../services/APIconn'
import DefaultImage from '../../../assets/images/defaulImage.jpeg'
import Cookies from 'js-cookie'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FetchError } from '../../../services/Errors'
import { CartContext } from '../../../contexts/CartContext'
import { ReservationContext } from '../../../contexts/ReservationContext'
import { format, parse, setHours, setMinutes } from 'date-fns'

const Checkout: React.FC = () => {
  const parseDateTime = (date: string, timeSlot: string): Date => {
    const [time, ampm] = timeSlot.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    const formattedHours =
      ampm === 'PM' && hours !== 12
        ? hours + 12
        : ampm === 'AM' && hours === 12
          ? 0
          : hours
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
    const updatedDate = setMinutes(
      setHours(parsedDate, formattedHours),
      minutes
    )
    return updatedDate
  }

  const { reservationData } = useContext(ReservationContext)
  const { items, totalPrice } = useContext(CartContext)
  const { state } = useLocation()
  const { restaurant } = state

  const dateTime = parseDateTime(
    reservationData?.date ?? '',
    reservationData?.selectedTimeslot ?? ''
  )

  const [wallet, setWallet] = useState<number>(0)
  const [note, setNote] = useState<string>('')
  const navigate = useNavigate()
  const userInfo = Cookies.get('userInfo')
  const user = userInfo ? JSON.parse(userInfo) : null

  useEffect(() => {
    const getWallet = async () => {
      try {
        const res = await fetchGET('/wallet/status')
        setWallet(res.balance)
      } catch (error) {
        if (error instanceof FetchError) {
          console.error(error.formatErrors())
        } else {
          console.error('Unexpected error')
        }
      }
    }
    getWallet()
  }, [])

  const totalCost =
    (restaurant?.reservationDeposit ?? 0) + (totalPrice ? totalPrice : 0)

  const canAfford =
    wallet >=
    (restaurant?.reservationDeposit
      ? restaurant.reservationDeposit
      : 0 + totalPrice
        ? totalPrice
        : 0)

  const onSubmit = async () => {
    try {
      const selectedPaymentMethod = (document.querySelector(
        'input[name="paymentMethod"]:checked'
      ) as HTMLInputElement)?.value;
      
      // jeśli Card to dodaje i odejmuje środki, jeśli Wallet to tylko odejmuje
      // jezeli wybralismy Card i mamy cos w koszyku ale to jest darmowe to tez nie chcemy robic add-money
      if (selectedPaymentMethod === 'Card' && items && items.length > 0 && totalCost > 0) {
        const addMoneyBody = JSON.stringify({
          title: `Funds deposit for order in: ${restaurant.name}`,
          amount: totalCost,
        });
        await fetchPOST('/wallet/add-money', addMoneyBody);
      }

      const visitBody = JSON.stringify({
        date: dateTime,
        endTime: new Date(new Date(dateTime).getTime() + 30 * 60000).toJSON(),
        numberOfGuests: reservationData
          ? reservationData.guests - getParticipantsIds().length
          : 0,
        tip: 0,
        takeaway: false,
        restaurantId: restaurant?.restaurantId,
        participantIds: getParticipantsIds()
      })
      const visitRes = await fetchPOST('/visits', visitBody)

      if (items && items.length > 0) {
        const orderBody = JSON.stringify({
          visitId: visitRes.visitId,
          note: note.trim() ? note : undefined,
          items: items
        })
        await fetchPOST('/orders', orderBody)
      }

      alert('Visit created successfully.')
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
        alert(error.formatErrors())
      } else {
        console.error('Unexpected error', error)
        alert('An unexpected error occurred.')
      }
    } finally {
      navigate('/reservant/home')
    }
  }

  const getParticipantsIds = (): string[] => {
    const res: string[] = []
    if (reservationData) {
      for (const friend of reservationData.friendsToAdd) {
        res.push(friend.userId)
      }
      res.push(user.userId)
    }
    return res
  }

  const formatDateTime = (date: Date): string => {
    return format(date, 'dd.MM.yyyy HH:mm')
  }

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4 text-sm bg-grey-1 dark:bg-grey-6 dark:text-grey-0">
      <div className="flex h-[90%] w-full items-center justify-center gap-6">
        {/* User and Payment Details */}
        <div className="flex h-full w-1/2 flex-col items-end justify-center gap-4">
          <div className="flex h-[150px] w-[350px] flex-col gap-2 rounded-lg bg-white shadow-md p-5 dark:bg-black">
            <h1 className="self-center font-mont-bd text-xl">User details</h1>
            <div className="separator flex flex-col divide-y-[1px] divide-grey-2">
              <span className="flex justify-between py-1">
                <label>First name:</label>
                <label>{user.firstName}</label>
              </span>
              <span className="flex justify-between py-1">
                <label>Last name:</label>
                <label>{user.lastName}</label>
              </span>
            </div>
          </div>

          <div className="flex h-[150px] w-[350px] flex-col gap-3 rounded-lg bg-white shadow-md p-5 dark:bg-black">
            <h1 className="self-center font-mont-bd text-xl">
              Select payment method
            </h1>
            <div className="flex flex-col gap-2">
              <div className="flex w-full items-center gap-3  ">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Wallet"
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
                  value="Card"
                  defaultChecked={!canAfford}
                  className=" h-5 w-5 cursor-pointer border-[1px] border-grey-2 text-grey-3 checked:text-primary dark:checked:text-secondary"
                />
                <span className="">Card</span>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {items?.length > 0 && (
            <div className="flex h-[300px] w-[350px] flex-col gap-3 rounded-lg bg-white shadow-md p-5 dark:bg-black">
              <h1 className="self-center font-mont-bd text-xl">
                Additional notes
              </h1>
              <textarea
                className="h-full w-full resize-none rounded-lg border-grey-1 dark:border-grey-6 dark:bg-black"
                onChange={e => setNote(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Reservation and Order Details */}
        <div className="flex h-full w-1/2 flex-col items-start justify-center gap-4">
          <div className="flex h-[calc(300px+1rem)] w-[350px] flex-col gap-2 rounded-lg bg-white shadow-md p-5 dark:bg-black">
            <h1 className="self-center font-mont-bd text-xl">
              Reservation details
            </h1>
            <div className="separator flex flex-col divide-y-[1px] divide-grey-2">
              <span className="flex justify-between py-1">
                <label>Total number of guests:</label>
                <label>{reservationData?.guests}</label>
              </span>
              <span className="flex justify-between py-1">
                <label>Date of reservation:</label>
                <label>{formatDateTime(dateTime)}</label>
              </span>
              <span className="flex justify-between py-1">
                <label>Reservation duration:</label>
                <label>30 min</label>
              </span>
              <span className="flex justify-between py-1">
                <label>Reservation deposit:</label>
                <label>{restaurant?.reservationDeposit ?? 0} zł</label>
              </span>
              <span className="flex justify-between py-1">
                <label>Order cost:</label>
                <label>{totalPrice ? totalPrice : 0} zł</label>
              </span>
              <span className="flex justify-between py-1">
                <label>Total cost:</label>
                <label>{totalCost} zł</label>
              </span>
            </div>
          </div>

          {items?.length > 0 && (
            <div className="flex h-[300px] w-[350px] flex-col gap-1 rounded-lg bg-white shadow-md p-5 dark:bg-black">
              <h1 className="self-center font-mont-bd text-xl">
                Order details
              </h1>
              <div className="scrollbar max-h-[calc(300px-2rem)] overflow-y-auto">
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

      {/* Submit Button */}
      <div className="absolute bottom-4 right-4 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-grey-2 py-2 px-4 shadow-md hover:bg-primary hover:text-white"
        >
          <ArrowBackIcon />
        </button>
        <button
          onClick={onSubmit}
          className="rounded-lg bg-grey-2 py-2 px-4 shadow-md hover:bg-primary hover:text-white"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default Checkout
