import React, { useEffect, useState } from 'react'
import {
  getImage,
  fetchPOST,
  fetchGET,
  fetchDELETE
} from '../../../../services/APIconn'
import Cookies from 'js-cookie'
import Dialog from '../../../reusableComponents/Dialog'
import { useTranslation } from 'react-i18next'

interface Participant {
  userId: string
  firstName: string
  lastName: string
  photo: string | null
}

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

interface FocusedRestaurantEventDetailsProps {
  event: Event
  interestedEventsIds: number[]
  updateInterestedEvents: (updatedIds: number[]) => void
}

const FocusedRestaurantEventDetails: React.FC<
  FocusedRestaurantEventDetailsProps
> = ({ event, interestedEventsIds, updateInterestedEvents }) => {
  const userId = JSON.parse(Cookies.get('userInfo') as string).userId
  const isCreator = userId === event.creator.userId
  const [participants, setParticipants] = useState<Participant[]>([])
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const isParticipant = participants.some(
    participant => participant.userId === userId
  )
  const isInterested = interestedEventsIds.includes(event.eventId)

  const [t] = useTranslation('global')

  const fetchParticipants = async () => {
    try {
      const data = await fetchGET(`/events/${event.eventId}`)
      setParticipants(data.participants)
    } catch (error) {
      console.error('Error fetching participants:', error)
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  const handleInterestClick = async () => {
    try {
      await fetchPOST(`/events/${event.eventId}/interested`)
      fetchParticipants()
      updateInterestedEvents([...interestedEventsIds, event.eventId])
    } catch (error) {
      console.error('Error sending interest request:', error)
    }
  }

  const handleRemoveInterest = async () => {
    try {
      await fetchDELETE(`/events/${event.eventId}/interested`)
      fetchParticipants()
      updateInterestedEvents(
        interestedEventsIds.filter(id => id !== event.eventId)
      )
    } catch (error) {
      console.error('Error removing interest:', error)
    }
  }

  const handleLeaveEvent = async () => {
    try {
      await fetchDELETE(`/events/${event.eventId}/interested`)
      fetchParticipants()
      setShowLeaveDialog(false)
    } catch (error) {
      console.error('Error leaving event:', error)
    }
  }

  return (
    <div className="p-0 rounded-lg dark:text-grey-1 bg-grey-1">
      {event.photo && (
        <img
          src={getImage(event.photo, '')}
          alt={`${event.name} event`}
          className="w-full h-auto rounded-t-lg object-cover"
          style={{ maxHeight: '200px' }}
        />
      )}
      <div className="p-3 dark:bg-black">
        <h2 className="font-bold text-xl text-left break-words whitespace-pre-wrap">
          {event.name}
        </h2>
        <p className="text-left mb-4 break-words whitespace-pre-wrap">
          {event.description}
        </p>

        <div className="flex justify-between text-sm text-left">
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-mont-bd text-primary dark:text-secondary">
                {t('profile.events.date')}:
              </span>{' '}
              {new Date(event.time).toLocaleString()}
            </p>
            <p>
              <span className="font-mont-bd text-primary dark:text-secondary">
                {t('profile.events.applications-by')}:
              </span>{' '}
              {new Date(event.mustJoinUntil).toLocaleString()}
            </p>
            <p>
              <span className="font-mont-bd text-primary dark:text-secondary">
                {t('profile.events.creator')}:
              </span>{' '}
              {event.creator.firstName} {event.creator.lastName}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-mont-bd text-primary dark:text-secondary">
                {t('profile.events.participants')}:
              </span>{' '}
              {event.numberInterested}
            </p>
            <p>
              <span className="font-mont-bd text-primary dark:text-secondary">
                {t('profile.events.participantss')}:
              </span>{' '}
              {participants.length}
            </p>
            <p>
              <span className="font-mont-bd text-primary dark:text-secondary">
                {t('profile.events.max-participants')}:
              </span>{' '}
              {event.maxPeople}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          {!isCreator && (
            <button
              onClick={
                isParticipant
                  ? () => setShowLeaveDialog(true)
                  : isInterested
                    ? handleRemoveInterest
                    : handleInterestClick
              }
              className={
                ' w-3/4 px-4 py-2 transition text-primary dark:border-secondary dark:text-secondary hover:bg-primary hover:text-white border-primary dark:hover:bg-secondary dark:hover:text-black border-[1px] rounded-md'
              }
            >
              {isParticipant
                ? 'Opuść wydarzenie'
                : isInterested
                  ? 'Usuń zainteresowanie'
                  : 'Zainteresuj się'}
            </button>
          )}
          {isCreator && (
            <button
              disabled
              className="w-3/4 py-2 rounded-lg bg-grey-3 text-black cursor-not-allowed"
            >
              Jesteś twórcą tego eventu
            </button>
          )}
        </div>
      </div>

      {showLeaveDialog && (
        <Dialog
          open={showLeaveDialog}
          onClose={() => setShowLeaveDialog(false)}
          title="Potwierdzenie wyjścia"
        >
          <div className="p-4 dark:text-white">
            <p className="mb-4">
              Czy na pewno chcesz opuścić wydarzenie{' '}
              <strong>{event.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 transition text-primary dark:border-secondary dark:text-secondary hover:bg-primary hover:text-white border-primary dark:hover:bg-secondary dark:hover:text-black border-[1px] rounded-md"
                onClick={handleLeaveEvent}
              >
                Tak
              </button>
              <button
                className="px-4 py-2 transition text-primary dark:border-secondary dark:text-secondary hover:bg-primary hover:text-white border-primary dark:hover:bg-secondary dark:hover:text-black border-[1px] rounded-md"
                onClick={() => setShowLeaveDialog(false)}
              >
                Nie
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default FocusedRestaurantEventDetails
