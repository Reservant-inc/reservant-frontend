import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { fetchGET } from '../../../../services/APIconn'
import Event from './Event'
import { EventDataType, PaginationType } from '../../../../services/types'
import { EventListType } from '../../../../services/enums'
import Filters from '../../../reusableComponents/Filters'
import { useTranslation } from 'react-i18next'

interface EventListProps {
  listType: EventListType
}

const EventList: React.FC<EventListProps> = ({ listType }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [events, setEvents] = useState<EventDataType[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventDataType[]>([])
  const [t] = useTranslation('global')

  const location = useLocation()

  const apiRoutes: Record<EventListType, string> = {
    [EventListType.Created]: '/user/events?category=CreatedBy&order=DateDesc',
    [EventListType.Interested]: '/user/events?category=InterestedIn',
    [EventListType.Participates]: '/user/events?category=ParticipateIn',
    [EventListType.History]: '/events?friendsOnly=false'
  }

  const noEventsMessage: Record<EventListType, string> = {
    [EventListType.Created]: `${t('profile.events.no-created')}`,
    [EventListType.Interested]: `${t('profile.events.no-interested-in')}`,
    [EventListType.Participates]: `${t('profile.events.no-participates')}`,
    [EventListType.History]: `${t('profile.events.no-event-history')}`
  }

  const apiRoute = apiRoutes[listType]

  useEffect(() => {
    fetchEvents()
  }, [location])

  useEffect(() => {
    setFilteredEvents(events)
  }, [events])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response: PaginationType = await fetchGET(apiRoute)
      const data: EventDataType[] = response.items as EventDataType[]
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* Filters component */}
          <div className="h-[6%]">
            <Filters
              data={events}
              onFilterChange={setFilteredEvents}
              sortBy="time"
              filterByName="name"
            />
          </div>
          <div className="flex flex-col h-[94%] pr-2 overflow-y-auto scroll divide-y-[1px] divide-grey-1">
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
        </>
      )}
    </div>
  )
}

export default EventList
