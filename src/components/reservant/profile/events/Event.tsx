import React, { useState } from 'react'
import {
  fetchDELETE,
  fetchGET,
  fetchPOST,
  getImage
} from '../../../../services/APIconn'
import {
  EventDataType,
  EventDialogState,
  InterestedUser
} from '../../../../services/types'
import { EventListType } from '../../../../services/enums'
import EventDialog from './EventDialog'

interface EventProps {
  event: EventDataType
  listType: EventListType
  refreshEvents: () => void
}

const Event: React.FC<EventProps> = ({ event, listType, refreshEvents }) => {
  const [dialogState, setDialogState] = useState<EventDialogState>({
    isOpen: false,
    type: null
  })
  const [eventDetails, setEventDetails] = useState<EventDataType | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([])

  const openDialog = (
    type: 'delete' | 'leave' | 'details' | 'manageParticipants' | 'edit'
  ) => {
    setDialogState({ isOpen: true, type })
    if (type === 'details') {
      fetchEventDetails()
    }
    if (type === 'manageParticipants') {
      fetchEventDetails()
      fetchInterestedUsers()
    }
  }

  const closeDialog = () => {
    setDialogState({ isOpen: false, type: null })
  }

  const handleDeleteEvent = async () => {
    try {
      await fetchDELETE(`/events/${event.eventId}`)
      closeDialog()
      refreshEvents()
      console.log('Event deleted')
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const handleLeaveEvent = async () => {
    try {
      await fetchDELETE(`/events/${event.eventId}/interested`)
      closeDialog()
      refreshEvents()
      console.log('Left event')
    } catch (error) {
      console.error('Error leaving event:', error)
    }
  }

  const fetchEventDetails = async () => {
    setLoadingDetails(true)
    try {
      const response = await fetchGET(`/events/${event.eventId}`)
      setEventDetails(response)
    } catch (error) {
      console.error('Error fetching event details:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const fetchInterestedUsers = async () => {
    setLoadingParticipants(true)
    try {
      const response = await fetchGET(`/events/${event.eventId}/interested`)
      setInterestedUsers(response.items || [])
    } catch (error) {
      console.error('Error fetching interested users:', error)
    } finally {
      setLoadingParticipants(false)
    }
  }

  const handleAcceptUser = async (userId: string) => {
    try {
      await fetchPOST(`/events/${event.eventId}/accept-user/${userId}`)
      fetchInterestedUsers()
      fetchEventDetails()
    } catch (error) {
      console.error('Error accepting user:', error)
    }
  }

  const handleRejectUser = async (userId: string) => {
    try {
      await fetchPOST(`/events/${event.eventId}/reject-user/${userId}`)
      fetchInterestedUsers()
    } catch (error) {
      console.error('Error rejecting user:', error)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {listType === EventListType.History && (
          <h1 className="text-sm italic">
            One or more of your friends participated in this event.
          </h1>
        )}

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
      </div>

      <div className="flex gap-2">
        {listType === EventListType.History && (
          <button
            className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
            onClick={() => openDialog('details')}
          >
            Szczegóły
          </button>
        )}
        {listType === EventListType.Interested && (
          <button
            className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105 mt-4"
            onClick={() => openDialog('leave')}
          >
            Usuń zainteresowanie
          </button>
        )}
        {listType === EventListType.Participates && (
          <button
            className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105 mt-4"
            onClick={() => openDialog('leave')}
          >
            Opuść
          </button>
        )}
        {listType === EventListType.Created && (
          <>
            <button
              className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
              onClick={() => openDialog('manageParticipants')}
            >
              Zarządzaj uczestnikami
            </button>
            <button
              className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
              onClick={() => openDialog('edit')}
            >
              Edytuj
            </button>
            <button
              className="bg-primary hover:bg-primary-2 text-white py-1 px-3 rounded transition hover:scale-105"
              onClick={() => openDialog('delete')}
            >
              Usuń
            </button>
          </>
        )}
      </div>

      {dialogState.isOpen && (
        <EventDialog
          dialogState={dialogState}
          event={event}
          eventDetails={eventDetails}
          interestedUsers={interestedUsers}
          loadingDetails={loadingDetails}
          loadingParticipants={loadingParticipants}
          onClose={closeDialog}
          onDelete={handleDeleteEvent}
          onLeave={handleLeaveEvent}
          onRejectUser={handleRejectUser}
          onAcceptUser={handleAcceptUser}
        />
      )}
    </>
  )
}

export default Event
