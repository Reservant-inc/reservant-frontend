import React, { useState, useEffect } from 'react'
import { fetchGET, getImage } from '../../../../services/APIconn'
import { useNavigate } from 'react-router-dom'
import NoImage from '../../../../assets/images/no-image.png'
import Dialog from '../../../reusableComponents/Dialog'

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
    <Dialog open={open} onClose={onClose} title="Event Details">
      <div className="flex flex-col">
        <h1 className="text-primary text-start font-bold p-2">
          Utworzyłeś nowy event
        </h1>

        <img
          src={getImage(eventDetails?.photo, NoImage)}
          alt="Event"
          className="w-full h-auto object-cover rounded-sm"
        />

        <div className="p-6">
          {loading && <p className="dark:text-white">Loading event details...</p>}
          {error && <p className="text-red">{error}</p>}

          {eventDetails && (
            <div className="pb-2">
              <h2 className="text-lg font-bold text-primary">
                {eventDetails.name}
              </h2>

              <p className="text-black dark:text-white">
                {formatDate(eventDetails.time)}
              </p>

              <p className="text-grey-4 italic text-start">
                {eventDetails.description}
              </p>
            </div>
          )}

          <div className="flex justify-end w-full space-x-4">
            <button
              onClick={() =>
                navigate(
                  `/reservant/profile/${userId}/event-history/created`
                )
              }
              disabled={!userId} 
              className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Go to My Events
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default EventDetailsModal
