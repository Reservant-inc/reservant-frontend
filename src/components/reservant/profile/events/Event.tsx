import React, { useEffect, useState } from 'react'
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
import DefaultImage from '../../../../assets/images/user.jpg'
import Cookies from 'js-cookie'
import { format } from 'date-fns'
import ConfirmationDialog from '../../../reusableComponents/ConfirmationDialog'
import ParticipantMenageDialog from './ParticipantMenageDialog'
import EventEditDialog from './EventEditDialog'
import { useTranslation } from 'react-i18next'

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
  const [participants, setParticipants] = useState<InterestedUser[]>([])
  const [t] = useTranslation('global')

  const userInfo = JSON.parse(Cookies.get('userInfo') as string)

  const creator = event.creator
  const restaurant = event.restaurant

  const openDialog = async (
    type: 'delete' | 'leave' | 'details' | 'manageParticipants' | 'edit'
  ) => {
    setDialogState({ isOpen: true, type })

    if (type === 'details') {
      await fetchEventDetails()
    }

    if (type === 'edit') {
      await fetchEventDetails()
    }

    if (type === 'manageParticipants') {
      await fetchEventDetails()
      await fetchInterestedUsers()
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
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const handleLeaveEvent = async () => {
    try {
      await fetchDELETE(`/events/${event.eventId}/interested`)
      closeDialog()
      refreshEvents()
    } catch (error) {
      console.error('Error leaving event:', error)
    }
  }

  const fetchEventDetails = async () => {
    setLoadingDetails(true)
    try {
      const response = await fetchGET(`/events/${event.eventId}`)
      setEventDetails(response)
      setParticipants(response.participants || [])
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

  const handleSucces = () => {
    closeDialog()
    refreshEvents()
  }

  return (
    <div className="py-4">
      <div className="flex flex-col divide-y-none gap-2">
        {listType === EventListType.History && (
          <h1 className="text-sm text-grey-2 dark:text-grey-3 italic">
            {userInfo.userId !== creator.userId
              ? `${t('profile.events.friend-participate')}`
              : `${t('profile.events.you-created-event')}`}
          </h1>
        )}

        <div className="flex gap-2 items-center">
          <img
            src={getImage(creator.photo, DefaultImage)}
            className="h-9 w-9 rounded-full"
          />
          <div className="flex-col gap-1">
            <h1 className="flex flex-wrap gap-x-1">
              <p className="font-mont-bd text-grey-5 dark:text-grey-0">
                {creator.firstName} {creator.lastName}
              </p>
              <p className="text-grey-5 dark:text-grey-0">
                {t('profile.events.participatedIn')}
              </p>
              <p className="font-mont-bd">{event.name}</p>
              <p className="text-grey-5 dark:text-grey-0">
                {t('profile.events.at')}
              </p>
              <a href={`/reservant/home/${restaurant?.restaurantId}`}>
                <p className="font-mont-bd">{restaurant?.name}</p>
              </a>
            </h1>
            <div className="flex gap-1">
              <h1 className="text-sm text-grey-4 dark:text-grey-2">
                {event.restaurant?.city}, {formatDate(event.time)}
              </h1>
              {event.participants && (
                <h1 className="text-sm text-grey-4 dark:text-grey-2 underline hover:cursor-pointer">
                  {event.participants.length} {t('profile.events.participated')}
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

      <div className="flex gap-2 py-3">
        {listType === EventListType.Interested && (
          <button
            className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition  hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            onClick={() => openDialog('leave')}
          >
            {t('profile.events.revoke')}
          </button>
        )}
        {listType === EventListType.Participates && (
          <button
            className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition  hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            onClick={() => openDialog('leave')}
          >
            {t('profile.events.leave')}
          </button>
        )}
        <div className="flex space-x-4">
          {listType === EventListType.Created && (
            <>
              <button
                className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition  hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                onClick={() => openDialog('manageParticipants')}
              >
                {t('profile.events.manage')}
              </button>
              <button
                className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition  hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                onClick={() => openDialog('edit')}
              >
                {t('profile.events.edit')}
              </button>
              <button
                className="border-[1px] rounded-md p-1 bg-white dark:bg-black border-primary text-primary transition  hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                onClick={() => openDialog('delete')}
              >
                {t('profile.events.delete')}
              </button>
            </>
          )}
        </div>
      </div>

      {dialogState.isOpen && dialogState.type === 'manageParticipants' && (
        <ParticipantMenageDialog
          open={dialogState.isOpen}
          onClose={closeDialog}
          participants={participants}
          interestedUsers={interestedUsers}
          onAcceptUser={handleAcceptUser}
          onRejectUser={handleRejectUser}
          mustJoinUntil={eventDetails?.mustJoinUntil}
          maxPeople={eventDetails?.maxPeople}
        />
      )}

      {dialogState.isOpen &&
        dialogState.type === 'edit' &&
        eventDetails !== null && (
          <EventEditDialog
            open={dialogState.isOpen}
            onClose={closeDialog}
            event={eventDetails}
            onSuccess={handleSucces}
          />
        )}

      {dialogState.isOpen && dialogState.type === 'leave' && (
        <ConfirmationDialog
          open={dialogState.isOpen}
          onClose={closeDialog}
          onConfirm={handleLeaveEvent}
          confirmationText="Are you sure you want to leave this event?"
        />
      )}

      {dialogState.isOpen && dialogState.type === 'delete' && (
        <ConfirmationDialog
          open={dialogState.isOpen}
          onClose={closeDialog}
          onConfirm={handleDeleteEvent}
          confirmationText="Are you sure you want to delete this event?"
        />
      )}
    </div>
  )
}

export default Event
