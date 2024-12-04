import React, { useEffect, useState } from 'react'
import { ReservationListType } from '../../../../services/enums'
import { useLocation } from 'react-router-dom'
import { PaginationType, VisitType } from '../../../../services/types'
import { fetchGET } from '../../../../services/APIconn'
import Reservation from './Reservation'

interface ReservationListProps {
  listType: ReservationListType
}

const ReservationList: React.FC<ReservationListProps> = ({ listType }) => {
  const [reservations, setReservations] = useState<VisitType[]>([])

  const location = useLocation()

  const apiRoutes: Record<ReservationListType, string> = {
    [ReservationListType.Incoming]: '/user/visits',
    [ReservationListType.Finished]: '/user/visit-history'
  }

  const noEventsMessage: Record<ReservationListType, string> = {
    [ReservationListType.Incoming]: 'Brak nadchodzących rezerwacji.',
    [ReservationListType.Finished]: 'Brak historii rezerwacji'
  }

  const apiRoute = apiRoutes[listType]

  useEffect(() => {
    fetchReservations()
  }, [location])

  const fetchReservations = async () => {
    try {
      const response: PaginationType = await fetchGET(apiRoute)

      const data: VisitType[] = response.items as VisitType[]

      setReservations(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col h-full p-2 pr-3 overflow-y-auto scroll divide-y-[1px] divide-grey-0">
          {reservations.length === 0 ? (
            <p className="italic text-center">{noEventsMessage[listType]}</p>
          ) : (
            reservations.map(reservation => (
              <Reservation
                reservation={reservation}
                key={reservation.visitId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationList
