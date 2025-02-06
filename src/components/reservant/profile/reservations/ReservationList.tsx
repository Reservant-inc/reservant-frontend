import React, { useEffect, useState } from 'react'
import { ReservationListType } from '../../../../services/enums'
import { useLocation } from 'react-router-dom'
import { PaginationType, VisitType } from '../../../../services/types'
import { fetchGET } from '../../../../services/APIconn'
import Reservation from './Reservation'
import { FetchError } from '../../../../services/Errors'
import Filters from '../../../reusableComponents/Filters'
import { useTranslation } from 'react-i18next'

interface ReservationListProps {
  listType: ReservationListType
}

const ReservationList: React.FC<ReservationListProps> = ({ listType }) => {
  const [reservations, setReservations] = useState<VisitType[]>([])
  const [filteredReservations, setFilteredReservations] = useState<VisitType[]>(
    []
  )

  const location = useLocation()
  const [t] = useTranslation('global')

  const apiRoutes: Record<ReservationListType, string> = {
    [ReservationListType.Incoming]: '/user/visits',
    [ReservationListType.Finished]: '/user/visit-history'
  }

  const noEventsMessage: Record<ReservationListType, string> = {
    [ReservationListType.Incoming]: `${t('reservation.no-upcoming')}`,
    [ReservationListType.Finished]: `${t('reservation.no-history')}`
  }

  const apiRoute = apiRoutes[listType]

  useEffect(() => {
    fetchReservations()
  }, [location])

  const fetchReservations = async () => {
    try {
      const response: PaginationType = await fetchGET(apiRoute)
      const newReservations: VisitType[] = response.items as VisitType[]

      setReservations(newReservations)
      setFilteredReservations(newReservations)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error occurred')
      }
    }
  }

  const handleFilterChange = (filteredData: VisitType[]) => {
    setFilteredReservations(filteredData)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className=" h-[6%]">
        <Filters
          data={reservations}
          onFilterChange={handleFilterChange}
          sortBy="date"
          filterByName="restaurant.name"
        />
      </div>
      <div className="flex flex-col gap-4 h-[94%]">
        <div
          id="scrollableDiv"
          className="flex flex-col h-full p-2 pr-3 overflow-y-auto scroll divide-y-[1px] divide-grey-0 dark:divide-grey-2"
        >
          {filteredReservations.length === 0 ? (
            <p className="italic text-center">{noEventsMessage[listType]}</p>
          ) : (
            filteredReservations.map(reservation => (
              <Reservation
                reservation={reservation}
                reservationType={listType}
                key={reservation.visitId}
                refreshReservations={() =>
                  setTimeout(() => {
                    fetchReservations()
                  }, 1000)
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationList
