import React, { useState, useEffect } from 'react'
import { OrderType, VisitType } from '../../../../services/types'
import { ReservationListType } from '../../../../services/enums'
import { fetchGET, getImage } from '../../../../services/APIconn'
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'
import { FetchError } from '../../../../services/Errors'
import { format } from 'date-fns'

interface ReservationProps {
  reservation: VisitType
  listType: ReservationListType
  refreshEvents: Function
}

const Reservation: React.FC<ReservationProps> = ({
  reservation,
  listType,
  refreshEvents
}) => {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await Promise.all(
        reservation.orders.map(async order => {
          const response = await fetchGET(`/orders/${order.orderId}`)
          return response
        })
      )

      setOrders(fetchedOrders)
      setLoading(false)
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      setLoading(false)
    }
  }

  const totalCost = reservation.orders.reduce(
    (sum, order) => sum + order.cost,
    0
  )

  useEffect(() => {
    if (reservation.orders.length > 0) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [reservation.orders])

  return (
    <div className="w-full h-fit flex justify-between py-2">
      <div className="flex gap-5">
        <img
          src={getImage(reservation.restaurant.logo, DefaultImage)}
          alt="restaurant logo"
          className="w-32 h-32 rounded-lg"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-mont-bd">
            {reservation.restaurant.name} {reservation.restaurant.city}
          </h1>

          <div className="flex gap-2">
            <h1 className="text-sm">
              {reservation.orders.length > 0
                ? `Pozycje: ${reservation.orders.length} za ${totalCost}zł`
                : 'Brak zamówień'}
              ,
            </h1>
            <h1 className="text-sm">
              {format(new Date(reservation.reservationDate), 'dd.MM HH:mm')}
            </h1>
          </div>
          <div className="flex flex-col gap-2 p-2">
            {orders.map(order =>
              order.items.map(item => (
                <div
                  key={item.menuItem.menuItemId}
                  className="flex gap-3 items-start"
                >
                  <div className="flex items-center justify-center w-6 h-6 border-[1px] border-grey-0">
                    <h1 className="text-sm">{item.amount}</h1>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm">
                      {item.menuItem.name} {item.totalCost}zł
                    </h1>
                    <h1 className="text-[12px]">{`${item.menuItem.alternateName ?? ''}${item.menuItem.alcoholPercentage !== null ? `${item.menuItem.alcoholPercentage}‰` : ''}`}</h1>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className={`text-sm px-4 border-[1px] rounded-md p-2 border-grey-0 bg-grey-0 transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
        >
          Make a complaint
        </button>
      </div>
    </div>
  )
}

export default Reservation
