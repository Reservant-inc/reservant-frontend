import React from 'react'
import { getImage } from '../../services/APIconn'

interface EventData {
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
  participants: Array<{
    userId: string
    firstName: string
    lastName: string
    photo: string
  }>
  restaurant: {
    restaurantId: number
    name: string
    address: string
    city: string
    logo: string
    rating: number
    numberReviews: number
  }
  numberInterested: number
  photo: string | null
}

interface EventDetailsProps {
  event: EventData
  activeTab: 'created' | 'interested' | 'participated'
  onDelete: () => void
  onManageParticipants: () => void
  onEdit: () => void
  onLeave: () => void
  onDetails: () => void
  useDetailsButton?: boolean
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  activeTab,
  onDelete,
  onManageParticipants,
  onEdit,
  onLeave,
  onDetails,
  useDetailsButton = false
}) => {
  const isCreatedTab = activeTab === 'created'
  const isInterestedTab = activeTab === 'interested'
  const isParticipatedTab = activeTab === 'participated'

  return (
    <div className="dark:text-grey-1 dark:bg-grey-2">
      {event.photo && (
        <img
          src={getImage(event.photo, '')}
          alt={`${event.name} event`}
          className="w-full h-auto object-cover"
          style={{ maxHeight: '200px' }}
        />
      )}
      <h2 className="font-bold text-xl">{event.name}</h2>
      <p className="text-sm">{event.description}</p>
      <p className="text-sm">
        <strong>Data wydarzenia:</strong>{' '}
        {new Date(event.time).toLocaleString()}
      </p>
      <p className="text-sm">
        <strong>Restauracja:</strong> {event.restaurant.name},{' '}
        {event.restaurant.city}
      </p>
      <p className="text-sm">
        <strong>Liczba zainteresowanych:</strong> {event.numberInterested}
      </p>

      {useDetailsButton ? (
        <button
          className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
          onClick={onDetails}
        >
          Szczegóły
        </button>
      ) : (
        <>
          {isCreatedTab && (
            <div className="flex gap-2 ">
              <button
                className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
                onClick={onEdit}
              >
                Edytuj
              </button>
              <button
                className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
                onClick={onManageParticipants}
              >
                Zarządzaj uczestnikami
              </button>
              <button
                className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
                onClick={onDelete}
              >
                Usuń
              </button>
            </div>
          )}
          {isInterestedTab && (
            <button
              className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105 mt-4"
              onClick={onDelete}
            >
              Usuń zainteresowanie
            </button>
          )}
          {isParticipatedTab && (
            <button
              className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105 mt-4"
              onClick={onLeave}
            >
              Opuść
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default EventDetails
