import React, { useEffect, useState } from 'react'
import {
  getImage,
  fetchPOST,
  fetchGET,
  fetchDELETE
} from '../../../../services/APIconn'
import Cookies from 'js-cookie'
import Dialog from '../../../reusableComponents/Dialog'

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
        <h2 className="font-bold text-xl text-left">{event.name}</h2>
        <p className="text-left mb-4">{event.description}</p>

        <div className="flex justify-between text-sm text-left">
          <div className="flex flex-col gap-2">
            <p>
              <strong className="text-primary dark:text-secondary">
                Kiedy?{' '}
              </strong>{' '}
              {new Date(event.time).toLocaleString()}
            </p>
            <p>
              <strong className="text-primary dark:text-secondary">
                Zgłoszenia do:{' '}
              </strong>{' '}
              {new Date(event.mustJoinUntil).toLocaleString()}
            </p>
            <p>
              <strong className="text-primary dark:text-secondary">
                Kto? :
              </strong>{' '}
              {event.creator.firstName} {event.creator.lastName}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              <strong className="text-primary dark:text-secondary">
                Uczestnicy:{' '}
              </strong>{' '}
              {event.numberInterested}
            </p>
            <p>
              <strong className="text-primary dark:text-secondary">
                Maks. uczestników:
              </strong>{' '}
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
              className={`w-3/4 py-2 rounded-lg transition hover:scale-105 dark:text-black ${
                isParticipant || isInterested
                  ? 'bg-primary text-white dark:bg-secondary'
                  : 'bg-primary text-white dark:bg-secondary'
              }`}
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
          <div className="p-4">
            <p className="mb-4">
              Czy na pewno chcesz opuścić wydarzenie{' '}
              <strong>{event.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
                onClick={handleLeaveEvent}
              >
                Tak
              </button>
              <button
                className="bg-grey-2 hover:bg-grey-3 text-white py-1 px-3 rounded transition hover:scale-105"
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
