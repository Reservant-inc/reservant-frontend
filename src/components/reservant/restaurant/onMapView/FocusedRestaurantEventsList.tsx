import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import FocusedRestaurantEventDetails from './FocusedRestaurantEventDetails'
import SearchIcon from '@mui/icons-material/Search'
import { fetchGET } from '../../../../services/APIconn'
import { useTranslation } from 'react-i18next'

interface Event {
  eventId: number
  name: string
  description: string
  time: string
  maxPeople: number
  mustJoinUntil: string
  creator: {
    userId: string
    firstName: string
    lastName: string
    photo: string | null
  }
  photo: string | null
  numberInterested: number
}

interface FocusedRestaurantEventsListProps {
  events: Event[]
}

const FocusedRestaurantEventsList: React.FC<
  FocusedRestaurantEventsListProps
> = ({ events }) => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events)
  const [interestedEventsIds, setInterestedEventsIds] = useState<number[]>([])

  const [t] = useTranslation('global')
  // Pobieramy listę zainteresowanych eventów po załadowaniu komponentu
  useEffect(() => {
    const fetchInterestedEvents = async () => {
      try {
        const response = await fetchGET('/user/events?category=InterestedIn')
        setInterestedEventsIds(
          response.items.map((event: Event) => event.eventId)
        )
      } catch (error) {
        console.error('Error fetching interested events:', error)
      }
    }
    fetchInterestedEvents()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    if (query.length >= 3) {
      setFilteredEvents(
        events.filter(event => event.name.toLowerCase().includes(query))
      )
    } else {
      setFilteredEvents(events)
    }
  }

  const updateInterestedEvents = (updatedIds: number[]) => {
    setInterestedEventsIds(updatedIds)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center rounded-full border-[1px] border-grey-1 bg-grey-0 px-1 font-mont-md dark:border-grey-6 dark:bg-grey-5">
        <input
          type="text"
          placeholder={t('home-page.events-search')}
          className="w-full placeholder:text-grey-2 dark:text-white"
          onChange={handleSearchChange}
        />
        <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
      </div>

      {filteredEvents.length > 0 ? (
        filteredEvents.map(event => (
          <FocusedRestaurantEventDetails
            key={event.eventId}
            event={event}
            interestedEventsIds={interestedEventsIds}
            updateInterestedEvents={updateInterestedEvents}
          />
        ))
      ) : (
        <div className="text-center dark:text-white">
          <p>{t('home-page.no-events-found')}</p>
        </div>
      )}
    </div>
  )
}

export default FocusedRestaurantEventsList
