import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { fetchGET } from '../../../../services/APIconn'
import Event from './Event'
import { EventDataType, PaginationType } from '../../../../services/types'
import { EventListType } from '../../../../services/enums'

interface EventListProps {
  listType: EventListType
}

const EventList: React.FC<EventListProps> = ({ listType }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [events, setEvents] = useState<EventDataType[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventDataType[]>([])

  const location = useLocation()

  const apiRoutes: Record<EventListType, string> = {
    [EventListType.Created]: '/user/events?category=CreatedBy',
    [EventListType.Interested]: '/user/events?category=InterestedIn',
    [EventListType.Participates]: '/user/events?category=ParticipateIn',
    [EventListType.History]: '/events?friendsOnly=false'
  }

  const noEventsMessage: Record<EventListType, string> = {
    [EventListType.Created]: 'Brak utworzonych wydarzeń.',
    [EventListType.Interested]: 'Nie jesteś zainteresowany żadnym wydarzeniem.',
    [EventListType.Participates]: 'Nie jesteś uczestnikiem żadnego wydarzenia.',
    [EventListType.History]: 'Brak wydarzen do wyswietlenia.'
  }

  const apiRoute = apiRoutes[listType]

  useEffect(() => {
    fetchEvents()
  }, [location])

  const fetchEvents = async () => {
    try {
      const response: PaginationType = await fetchGET(apiRoute)

      const data: EventDataType[] = response.items as EventDataType[]

      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()

    setFilteredEvents(
      query.length >= 3
        ? events.filter(event => event.name.toLowerCase().includes(query))
        : events
    )
  }

  return (
    <div className="flex flex-col bg-white rounded-lg w-full h-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex w-full items-center rounded-full border-[1px] border-grey-1 px-1 font-mont-md dark:border-grey-6">
          <input
            type="text"
            placeholder="Search events"
            className="w-full placeholder:text-grey-2"
            onChange={handleSearchChange}
          />
          <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
        </div>

        <div className="flex flex-col h-full pr-2 overflow-y-auto scroll divide-y-[1px] divide-grey-1">
          {filteredEvents.length === 0 ? (
            <p className="italic text-center">{noEventsMessage[listType]}</p>
          ) : (
            filteredEvents.map(event => (
              <Event
                event={event}
                listType={listType}
                refreshEvents={fetchEvents}
                key={event.eventId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default EventList
