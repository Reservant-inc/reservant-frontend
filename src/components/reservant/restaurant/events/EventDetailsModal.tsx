import React, { useState, useEffect } from 'react'
import { Modal } from '@mui/material'
import { fetchGET } from '../../../../services/APIconn'
import MyEventsModal from './MyEventsModal'

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
  const [showMyEventsModal, setShowMyEventsModal] = useState<boolean>(false)

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

  const handleGoToMyEvents = () => {
    setShowMyEventsModal(true) // Otwiera modal MyEvents
  }

  const handleMyEventsModalClose = () => {
    setShowMyEventsModal(false)
  }

  useEffect(() => {
    if (open) {
      fetchEventDetails()
    }
  }, [eventId, open])

  if (!open) return null

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

  const calculateParticipants = () => {
    const participantsCount = eventDetails.participants?.length || 0
    return eventDetails.creatorId ? participantsCount + 1 : participantsCount
  }

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-96 bg-grey-0 dark:bg-grey-5 shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-primary dark:text-white">
            Event Details
          </h2>

          {loading && (
            <p className="dark:text-white">Loading event details...</p>
          )}
          {error && <p className="text-error">{error}</p>}

          {eventDetails && (
            <div className="dark:text-white">
              <p>
                <strong>Event Name:</strong> {eventDetails.name}
              </p>
              <p>
                <strong>Created At:</strong>{' '}
                {formatDate(eventDetails.createdAt)}
              </p>
              <p>
                <strong>Description:</strong> {eventDetails.description}
              </p>
              <p>
                <strong>Event Time:</strong> {formatDate(eventDetails.time)}
              </p>
              <p>
                <strong>Must Join Until:</strong>{' '}
                {formatDate(eventDetails.mustJoinUntil)}
              </p>
              <p>
                <strong>Creator:</strong> {eventDetails.creatorFullName}
              </p>
              <p>
                <strong>Restaurant:</strong> {eventDetails.restaurantName}
              </p>
              <p>
                <strong>Participants:</strong> {calculateParticipants()} /{' '}
                {eventDetails.maxPeople}
              </p>
            </div>
          )}

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleGoToMyEvents}
              className="w-[180px] bg-grey-0 dark:bg-grey-5 rounded-lg text-primary dark:text-white hover:bg-grey-1 dark:hover:bg-grey-6 transition"
            >
              Go to My Events
            </button>
            <button
              onClick={onClose}
              className="w-[180px] bg-grey-0 dark:bg-grey-5 rounded-lg text-primary dark:text-white hover:bg-grey-1 dark:hover:bg-grey-6 transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* MyEvents Modal */}
      <MyEventsModal
        open={showMyEventsModal}
        onClose={handleMyEventsModalClose}
      />
    </>
  )
}

export default EventDetailsModal
