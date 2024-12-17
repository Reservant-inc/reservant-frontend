import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchGET } from '../../../../services/APIconn'
import Event from './Event'
import { EventDataType, PaginationType } from '../../../../services/types'
import { EventListType } from '../../../../services/enums'
import { Field, Formik } from 'formik'
import Search from '../../../reusableComponents/Search'
import { useTranslation } from 'react-i18next'

interface EventListProps {
  listType: EventListType
}

const EventList: React.FC<EventListProps> = ({ listType }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [events, setEvents] = useState<EventDataType[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventDataType[]>([])
  const [sortOrder, setSortOrder] = useState<string>('newest')
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [t] = useTranslation('global')

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
    [EventListType.History]: 'Brak wydarzeń do wyświetlenia.'
  }

  const apiRoute = apiRoutes[listType]

  useEffect(() => {
    fetchEvents()
  }, [location])

  useEffect(() => {
    sortAndFilterEvents()
  }, [sortOrder, startDate, endDate, events])

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

  const filterEvents = (query: string) => {
    setFilteredEvents(
      query.length >= 3
        ? events.filter(event => event.name.toLowerCase().includes(query))
        : events
    )
  }

  const sortAndFilterEvents = () => {
    let sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.time).getTime()
      const dateB = new Date(b.time).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    if (startDate || endDate) {
      sortedEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.time).toISOString().split('T')[0]
        if (startDate && eventDate < startDate) return false
        if (endDate && eventDate > endDate) return false
        return true
      })
    }

    setFilteredEvents(sortedEvents)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center  gap-2">
          <select
            value={sortOrder}
            onChange={handleSortChange}
            id="eventsSortSelect"
            className="border-[1px] h-full pl-3 pr-8 py-1 text-black bg-white dark:text-grey-1 rounded-lg border-grey-2 dark:border-grey-4 focus:border-primary dark:focus:border-secondary hover:cursor-pointer dark:bg-black"
          >
            <option value="newest" id="eventsNewest">
              {t('profile.events.newest')}
            </option>
            <option value="oldest" id="eventsOldest">
              {t('profile.events.oldest')}
            </option>
          </select>
          <Formik
            initialValues={{ startDate: '', endDate: '' }}
            onSubmit={() => {}}
          >
            {({ setFieldValue }) => (
              <div className="flex items-center h-full gap-2">
                <Field
                  name="startDate"
                  type="date"
                  label="Od"
                  id="eventStartDateFilter"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setStartDate(e.target.value)
                    setFieldValue('startDate', e.target.value)
                  }}
                  className="border-[1px] px-3 py-1 h-full rounded-lg text-black dark:text-grey-1  border-grey-2 dark:border-grey-4 focus:border-primary dark:focus:border-secondary hover:cursor-pointer dark:bg-black"
                />
                <Field
                  name="endDate"
                  type="date"
                  label="Do"
                  id="eventEndDateFilter"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEndDate(e.target.value)
                    setFieldValue('endDate', e.target.value)
                  }}
                  className="border-[1px] px-3 py-1 h-full rounded-lg text-black dark:text-grey-1  border-grey-2 dark:border-grey-4 focus:border-primary dark:focus:border-secondary hover:cursor-pointer dark:bg-black"
                />
              </div>
            )}
          </Formik>
          <Search
            filter={filterEvents}
            placeholder={t('profile.events.search')}
          />
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
