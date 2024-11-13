import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import {
  fetchGET,
  fetchDELETE,
  fetchPOST,
  getImage
} from '../../services/APIconn'
import Dialog from '../reusableComponents/Dialog'
import SearchIcon from '@mui/icons-material/Search'
import EventDetails from './EventDetails'
import ProfileTabs from './ProfileTabs'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import CheckSharpIcon from '@mui/icons-material/CheckSharp'
import UserDefault from '../../assets/images/user.jpg'

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

interface InterestedUser {
  userId: string
  firstName: string
  lastName: string
  photo: string
}

const EventHistory: React.FC = () => {
  const { pathname } = useLocation()
  const showTabs = !pathname.includes('/events')
  const useDetailsButton = pathname.includes('/events')

  const [createdEvents, setCreatedEvents] = useState<EventData[]>([])
  const [interestedEvents, setInterestedEvents] = useState<EventData[]>([])
  const [participatedEvents, setParticipatedEvents] = useState<EventData[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    'created' | 'interested' | 'participated'
  >('created')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [showManageParticipantsDialog, setShowManageParticipantsDialog] =
    useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null)
  const [eventDetails, setEventDetails] = useState<EventData | null>(null)
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([])
  const [loadingParticipants, setLoadingParticipants] = useState(false)

  const fetchEvents = async () => {
    try {
      // Jeżeli jesteśmy w Działo się to pobiera z /events. Jeśli nie jesteśmy w /events
      // To jesteśmy w Profilu i /event-history, więc pobieramy events Created by user

      // Teraz jest friendsOnly ale można zmienić
      const createdEndpoint = pathname.includes('/events')
        ? '/events?friendsOnly=false'
        : '/user/events?category=CreatedBy'

      // Pobiera eventy którymi jesteśmy zainteresowanie
      // I w których jesteśmy członkami
      const [createdResponse, interestedResponse, participatedResponse] =
        await Promise.all([
          fetchGET(createdEndpoint),
          fetchGET('/user/events?category=InterestedIn'),
          fetchGET('/user/events?category=ParticipateIn')
        ])
      setCreatedEvents(createdResponse.items || [])
      setInterestedEvents(interestedResponse.items || [])
      setParticipatedEvents(participatedResponse.items || [])
      setFilteredEvents(createdResponse.items || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [pathname])

  // zarządza zmianami zakładek eventów
  // W DZIEJE SIĘ ZAWSZE JEST NA ZAKŁADCE CREATED
  const handleTabChange = (tab: 'created' | 'interested' | 'participated') => {
    setActiveTab(tab)
    const eventsToShow =
      tab === 'created'
        ? createdEvents
        : tab === 'interested'
          ? interestedEvents
          : participatedEvents
    setFilteredEvents(eventsToShow)
  }

  // Usuwa wydarzenie jeśli jest się kreatorem
  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      const endpoint =
        activeTab === 'created'
          ? `/events/${eventToDelete.eventId}`
          : `/events/${eventToDelete.eventId}/interested`
      try {
        await fetchDELETE(endpoint)
        fetchEvents()
        setShowDeleteDialog(false)
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  // Usuwanie zainteresowania eventem
  const handleLeaveEvent = async () => {
    if (eventToDelete) {
      try {
        await fetchDELETE(`/events/${eventToDelete.eventId}/interested`)
        fetchEvents()
        setShowLeaveDialog(false)
      } catch (error) {
        console.error('Error leaving event:', error)
      }
    }
  }

  const fetchEventDetails = async (eventId: number) => {
    setLoadingParticipants(true)
    try {
      const response = await fetchGET(`/events/${eventId}`)
      setEventDetails(response)
      fetchInterestedUsers(eventId)
    } catch (error) {
      console.error('Error fetching event details:', error)
    } finally {
      setLoadingParticipants(false)
    }
  }

  // Pobieranie osób zainteresowanych danym eventem (Dla zarządzania członkami)
  const fetchInterestedUsers = async (eventId: number) => {
    try {
      const response = await fetchGET(`/events/${eventId}/interested`)
      setInterestedUsers(response.items || [])
    } catch (error) {
      console.error('Error fetching interested users:', error)
    }
  }

  // Odrzuca prośbę o dołączenie do eventu (Dla zarządzania członkami)
  const handleRejectUser = async (eventId: number, userId: string) => {
    try {
      await fetchPOST(`/events/${eventId}/reject-user/${userId}`)
      fetchInterestedUsers(eventId)
    } catch (error) {
      console.error('Error rejecting user:', error)
    }
  }

  // Akceptuje prośbę (Dla zarządzania członkami)
  const handleAcceptUser = async (eventId: number, userId: string) => {
    try {
      await fetchPOST(`/events/${eventId}/accept-user/${userId}`)
      fetchInterestedUsers(eventId)
      fetchEventDetails(eventId)
    } catch (error) {
      console.error('Error accepting user:', error)
    }
  }

  // Kontroluje filtrowanie po nazwie. Działa od 3 znaków
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    const eventsToFilter =
      activeTab === 'created'
        ? createdEvents
        : activeTab === 'interested'
          ? interestedEvents
          : participatedEvents
    setFilteredEvents(
      query.length >= 3
        ? eventsToFilter.filter(event =>
            event.name.toLowerCase().includes(query)
          )
        : eventsToFilter
    )
  }

  return (
    <div className="flex flex-col bg-white rounded-lg w-full h-full">
      {/* Circular Progress do ładowania */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress className="text-grey-0" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md h-full h-full">
            <div className="flex justify-between items-center">
              <h1 className="font-mont-bd text-lg">Events</h1>
              {/* Nie wyświetlaj zakładek  jeżeli pathname zawiera /events */}
              {showTabs && (
                <ProfileTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              )}
            </div>

            <div className="flex w-full items-center rounded-full border-[1px] border-grey-1 px-1 font-mont-md dark:border-grey-6">
              <input
                type="text"
                placeholder="Search events"
                className="w-full placeholder:text-grey-2"
                onChange={handleSearchChange}
              />
              <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
            </div>

            <div className="flex flex-col gap-4 bg-white pr-2 overflow-y-auto h-full scroll">
              {filteredEvents.length === 0 ? (
                <p className="italic text-center">
                  {activeTab === 'created'
                    ? 'Brak utworzonych wydarzeń.'
                    : activeTab === 'interested'
                      ? 'Nie jesteś zainteresowany żadnym wydarzeniem.'
                      : 'Nie jesteś uczestnikiem żadnego wydarzenia.'}
                </p>
              ) : (
                filteredEvents.map(event => (
                  <EventDetails
                    key={event.eventId}
                    event={event}
                    activeTab={activeTab}
                    onDetails={() => setShowDetailsDialog(true)}
                    onDelete={() => {
                      setShowDeleteDialog(true)
                      setEventToDelete(event)
                    }}
                    onManageParticipants={() => {
                      setShowManageParticipantsDialog(true)
                      fetchEventDetails(event.eventId)
                    }}
                    onEdit={() => console.log('Edytuj')}
                    onLeave={() => {
                      setShowLeaveDialog(true)
                      setEventToDelete(event)
                    }}
                    useDetailsButton={useDetailsButton}
                  />
                ))
              )}
            </div>
          </div>

          {/* Dialog dla "Szczegóły" w Działo się*/}
          {showDetailsDialog && (
            <Dialog
              open={showDetailsDialog}
              onClose={() => setShowDetailsDialog(false)}
              title="Szczegóły Wydarzenia"
            >
              <div className="p-4">
                <p>Tu szczegóły eventu ewentualnie dla Działo się</p>
              </div>
            </Dialog>
          )}

          {/* Dialog dla "Usuń" w Eventy > Utworzone*/}
          {showDeleteDialog && eventToDelete && (
            <Dialog
              open={showDeleteDialog}
              onClose={() => setShowDeleteDialog(false)}
              title=""
            >
              <div className="p-4">
                <p className="mb-4">
                  Czy na pewno chcesz{' '}
                  {activeTab === 'created'
                    ? 'usunąć wydarzenie'
                    : 'usunąć zainteresowanie'}{' '}
                  {eventToDelete.name}?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                    onClick={handleDeleteEvent}
                  >
                    Tak
                  </button>
                  <button
                    className="bg-primary-2 hover:bg-primary-3 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Nie
                  </button>
                </div>
              </div>
            </Dialog>
          )}

          {/* Dialog dla "Opuść" w Eventy > Uczestniczysz*/}
          {showLeaveDialog && eventToDelete && (
            <Dialog
              open={showLeaveDialog}
              onClose={() => setShowLeaveDialog(false)}
              title=""
            >
              <div className="p-4">
                <p className="mb-4">
                  Czy na pewno chcesz opuścić wydarzenie {eventToDelete.name}?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-primary hover:bg-primary-2 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                    onClick={handleLeaveEvent}
                  >
                    Tak
                  </button>
                  <button
                    className="bg-primary-2 hover:bg-primary-3 text-white my-2 py-1 px-3 rounded transition hover:scale-105"
                    onClick={() => setShowLeaveDialog(false)}
                  >
                    Nie
                  </button>
                </div>
              </div>
            </Dialog>
          )}

          {/* Dialog dla "Zarządzaj uczestnikami" w Eventy > Utworzone*/}
          {showManageParticipantsDialog && (
            <Dialog
              open={showManageParticipantsDialog}
              onClose={() => setShowManageParticipantsDialog(false)}
              title=""
            >
              <div className="flex p-4 w-[600px] h-[190px] overflow-y-auto scroll">
                {loadingParticipants ? (
                  <CircularProgress className="m-auto text-grey-0" />
                ) : (
                  <>
                    <div className="w-1/2 p-2">
                      <h2 className="font-semibold text-lg mb-3">Uczestnicy</h2>
                      {eventDetails &&
                      eventDetails.participants.length === 0 ? (
                        <p className="italic text-center">Brak uczestników</p>
                      ) : (
                        eventDetails?.participants.map(participant => (
                          <div
                            key={participant.userId}
                            className="flex items-center mb-3 gap-4"
                          >
                            <img
                              src={getImage(participant.photo, UserDefault)}
                              alt={`${participant.firstName} ${participant.lastName}`}
                              className="h-10 w-10 rounded-full"
                            />
                            <span>
                              {participant.firstName} {participant.lastName}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="w-1/2 p-2">
                      <h2 className="font-semibold text-lg mb-3">
                        Zainteresowani
                      </h2>
                      {interestedUsers.length === 0 ? (
                        <p className="italic text-center">
                          Brak zainteresowanych osób
                        </p>
                      ) : (
                        interestedUsers.map(user => (
                          <div
                            key={user.userId}
                            className="flex items-center mb-3 gap-4"
                          >
                            <img
                              src={getImage(user.photo, UserDefault)}
                              alt={`${user.lastName}`}
                              className="h-10 w-10 rounded-full"
                            />
                            <span>
                              {user.firstName} {user.lastName}
                            </span>
                            <div className="flex ml-auto gap-1">
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-md p-1 text-sm text-grey-2 hover:text-red"
                                onClick={() =>
                                  handleRejectUser(
                                    eventDetails!.eventId,
                                    user.userId
                                  )
                                }
                              >
                                <CloseSharpIcon className="h-5 w-5" />
                              </button>
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-md p-1 text-sm text-grey-2 hover:text-green"
                                onClick={() =>
                                  handleAcceptUser(
                                    eventDetails!.eventId,
                                    user.userId
                                  )
                                }
                              >
                                <CheckSharpIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </Dialog>
          )}
        </>
      )}
    </div>
  )
}

export default EventHistory
