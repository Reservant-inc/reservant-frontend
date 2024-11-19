import React, { useState, useEffect } from 'react'
import { OrderType, VisitType } from '../../../../services/types'
import { ReservationListType } from '../../../../services/enums'
import { fetchGET, getImage } from '../../../../services/APIconn'
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'
import { FetchError } from '../../../../services/Errors'

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
          return response.data
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
    <div className="w-fill h-fit p-2 flex justify-between">
      <div className="flex gap-3">
        <img
          src={getImage(reservation.restaurant.logo, DefaultImage)}
          alt="restaurant logo"
          className="w-32 h-32 rounded-lg"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-mont-bd">
            {reservation.restaurant.name} {reservation.restaurant.city}
          </h1>
          <h1 className="text-sm">
            {reservation.orders.length > 0
              ? `Pozycje: ${reservation.orders.length} za ${totalCost}zł`
              : 'Brak zamówień'}
          </h1>
          {!loading && orders.length > 0 && (
            <ul className="mt-2">
              {orders.map(order => (
                <li key={order.orderId} className="text-sm">
                  Order #{order.orderId} - {order.status} - {order.cost}zł
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default Reservation
