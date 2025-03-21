import React, { useState, useEffect } from 'react'
import { fetchGET, getImage } from '../../../../services/APIconn'
import { useNavigate } from 'react-router-dom'
import NoImage from '../../../../assets/images/no-image.png'
import Dialog from '../../../reusableComponents/Dialog'
import { useTranslation } from 'react-i18next'

interface EventDetailsModalProps {
  eventId: number
  open: boolean
  onClose: () => void
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  eventId,
  open,
  onClose
}) => {
  const [eventDetails, setEventDetails] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const navigate = useNavigate()

  const [t] = useTranslation('global')

  const fetchEventDetails = async () => {
    try {
      const data = await fetchGET(`/events/${eventId}`)
      setEventDetails(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch event details.')
      setLoading(false)
    }
  }

  const fetchUserDetails = async () => {
    try {
      const userData = await fetchGET('/user')
      setUserId(userData.userId)
    } catch (err) {
      console.error('Failed to fetch user details:', err)
    }
  }

  useEffect(() => {
    if (open) {
      fetchEventDetails()
      fetchUserDetails()
    }
  }, [eventId, open])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('event-creation.event-creation-title')}
    >
      <div className="flex flex-col max-w-[600px] scroll overflow-y-auto">
        <h1 className="text-primary dark:text-secondary text-start font-bold p-2">
          {t('event-creation.event-creation')}
        </h1>

        <img
          src={getImage(eventDetails?.photo, NoImage)}
          alt="Event"
          className="w-full max-h-[50vh] object-cover rounded-sm"
        />

        <div className="p-6">
          {loading && (
            <p className="dark:text-white">
              {t('event-creation.event-loading')}
            </p>
          )}
          {error && <p className="text-red">{error}</p>}

          {eventDetails && (
            <div className="pb-2">
              <h2 className="text-lg font-bold break-words whitespace-pre-wrap text-primary dark:text-secondary">
                {eventDetails.name}
              </h2>

              <p className="text-black dark:text-white">
                {formatDate(eventDetails.time)}
              </p>

              <p className="text-grey-4 italic break-words whitespace-pre-wrap text-start break-words whitespace-pre-wrap">
                {eventDetails.description}
              </p>
            </div>
          )}

          <div className="flex justify-end w-full space-x-4">
            <button
              onClick={() =>
                navigate(`/reservant/profile/${userId}/event-history/created`)
              }
              disabled={!userId}
              className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('event-creation.go-to-my-events')}
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            >
              {t('event-creation.close')}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default EventDetailsModal
