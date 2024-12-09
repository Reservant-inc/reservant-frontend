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
import DefaultImage from '../../../../assets/images/user.jpg'
import Cookies from 'js-cookie'
import { format } from 'date-fns'

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

  const userInfo = JSON.parse(Cookies.get('userInfo') as string)

  const creator = event.creator
  const restaurant = event.restaurant

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

  const formatDate = (date: string): string => {
    return format(new Date(date), 'dd.MM.yyyy HH:mm')
  }

  return (
    <div className="py-4">
      <div className="flex flex-col divide-y-none gap-2">
        {listType === EventListType.History && (
          <h1 className="text-sm text-grey-2 italic">
            {userInfo.userId !== creator.userId
              ? 'One or more of your friends participated in this event.'
              : 'You created an event.'}
          </h1>
        )}

        <div className="flex gap-2 items-center">
          <img
            src={getImage(creator.photo, DefaultImage)}
            className="h-9 w-9 rounded-full"
          />
          <div className="flex-col gap-1">
            <h1 className="flex flex-wrap gap-x-1">
              <p className="font-mont-bd text-grey-5">
                {creator.firstName} {creator.lastName}
              </p>
              <p className="text-grey-5">participated in</p>
              <p className="font-mont-bd">{event.name}</p>
              <p className="text-grey-5">at</p>
              <a href={`/reservant/home/${restaurant.restaurantId}`}>
                <p className="font-mont-bd">{restaurant.name}</p>
              </a>
            </h1>
            <div className="flex gap-1">
              <h1 className="text-sm text-grey-4">
                {event.restaurant.city}, {formatDate(event.time)}
              </h1>
              {event.participants && (
                <h1 className="text-sm text-grey-4 underline hover:cursor-pointer">
                  {event.participants.length} participants
                </h1>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm">{event.description}</p>

        {event.photo && (
          <img
            src={getImage(event.photo, '')}
            alt={`${event.name} event`}
            className="w-full h-auto object-cover rounded-sm "
          />
        )}
      </div>

      <div className="flex gap-2">
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
              className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={() => openDialog('manageParticipants')}
            >
              Zarządzaj uczestnikami
            </button>
            <button
              className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={() => openDialog('edit')}
            >
              Edytuj
            </button>
            <button
              className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
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
    </div>
  )
}

export default Event
