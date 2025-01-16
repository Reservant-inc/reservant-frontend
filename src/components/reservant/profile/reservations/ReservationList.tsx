import React, { useEffect, useState } from 'react'
import { ReservationListType } from '../../../../services/enums'
import { useLocation } from 'react-router-dom'
import { PaginationType, VisitType } from '../../../../services/types'
import { fetchGET } from '../../../../services/APIconn'
import Reservation from './Reservation'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CircularProgress } from '@mui/material'
import { FetchError } from '../../../../services/Errors'
import Filters from '../../../reusableComponents/Filters'

interface ReservationListProps {
  listType: ReservationListType
}

const ReservationList: React.FC<ReservationListProps> = ({ listType }) => {
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [reservations, setReservations] = useState<VisitType[]>([])
  const [filteredReservations, setFilteredReservations] = useState<VisitType[]>(
    []
  )

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
  }, [location, page])

  const fetchReservations = async () => {
    try {
      const response: PaginationType = await fetchGET(
        apiRoute + `?page=${page}`
      )
      const newReservations: VisitType[] = response.items as VisitType[]

      if (newReservations.length < 10) {
        setHasMore(false)
      } else {
        if (!hasMore) setHasMore(true)
      }

      const updatedReservations =
        page > 0 ? [...reservations, ...newReservations] : newReservations

      setReservations(updatedReservations)
      setFilteredReservations(updatedReservations)
      console.log(reservations)
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
          filterByName="restaurant"
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
            <InfiniteScroll
              dataLength={filteredReservations.length}
              next={() => setPage(prevPage => prevPage + 1)}
              hasMore={hasMore}
              loader={
                <CircularProgress className="self-center text-grey-2 w-10 h-10" />
              }
              scrollableTarget="scrollableDiv"
              className="overflow-y-hidden flex flex-col rounded-lg p-2"
            >
              {filteredReservations.map(reservation => (
                <Reservation
                  reservation={reservation}
                  reservationType={listType}
                  key={reservation.visitId}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationList
