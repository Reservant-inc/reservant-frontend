import React from 'react'
import Dialog from '../../reusableComponents/Dialog'
import CircularProgress from '@mui/material/CircularProgress'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import CheckSharpIcon from '@mui/icons-material/CheckSharp'
import { EventDataType, InterestedUser } from '../../../services/types'
import UserDefault from '../../../assets/images/user.jpg'

interface EventDialogProps {
  dialogState: { isOpen: boolean; type: 'delete' | 'leave' | 'details' | 'edit' | 'manageParticipants' | null }
  event: EventDataType
  eventDetails?: EventDataType | null
  interestedUsers: InterestedUser[]
  loadingDetails: boolean
  loadingParticipants: boolean
  onClose: () => void
  onDelete: () => void
  onLeave: () => void
  onRejectUser: (userId: string) => void
  onAcceptUser: (userId: string) => void
}

const EventDialog: React.FC<EventDialogProps> = ({
  dialogState,
  event,
  eventDetails,
  interestedUsers,
  loadingDetails,
  loadingParticipants,
  onClose,
  onDelete,
  onLeave,
  onRejectUser,
  onAcceptUser,
}) => {
  return (
    <Dialog
      open={dialogState.isOpen}
      onClose={onClose}
      title={
        dialogState.type === 'delete'
          ? 'Usuń wydarzenie'
          : dialogState.type === 'leave'
          ? 'Opuść wydarzenie'
          : dialogState.type === 'details'
          ? 'Szczegóły wydarzenia'
          : dialogState.type === 'edit'
          ? 'Edytuj wydarzenia'
          : 'Zarządzaj uczestnikami'
      }
    >
      {dialogState.type === 'delete' && (
        <div>
          <p>Czy na pewno chcesz usunąć wydarzenie {event.name}?</p>
          <button onClick={onDelete} className="btn-confirm">
            Tak
          </button>
          <button onClick={onClose} className="btn-cancel">
            Nie
          </button>
        </div>
      )}

      {dialogState.type === 'leave' && (
        <div>
          <p>Czy na pewno chcesz opuścić wydarzenie {event.name}?</p>
          <button onClick={onLeave} className="btn-confirm">
            Tak
          </button>
          <button onClick={onClose} className="btn-cancel">
            Nie
          </button>
        </div>
      )}

      {dialogState.type === 'details' && (
        <div>
          {loadingDetails ? (
            <p>Ładowanie szczegółów...</p>
          ) : (
            <div>
              <p>{eventDetails?.description}</p>
            </div>
          )}
        </div>
      )}

      {dialogState.type === 'edit' && (
        <div>
          {loadingDetails ? (
            <p>Ładowanie szczegółów...</p>
          ) : (
            <div>
              <p>tbd</p>
            </div>
          )}
        </div>
      )}

      {dialogState.type === 'manageParticipants' && (
        <div className="flex p-4 w-[600px] h-[190px] overflow-y-auto scroll">
          {loadingParticipants ? (
            <CircularProgress className="m-auto text-grey-0" />
          ) : (
            <>
              <div className="w-1/2 p-2">
                <h2 className="font-semibold text-lg mb-3">Uczestnicy</h2>
                {eventDetails?.participants.length === 0 ? (
                  <p className="italic text-center">Brak uczestników</p>
                ) : (
                  eventDetails?.participants.map(participant => (
                    <div
                      key={participant.userId}
                      className="flex items-center mb-3 gap-4"
                    >
                      <img
                        src={participant.photo || UserDefault}
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
                <h2 className="font-semibold text-lg mb-3">Zainteresowani</h2>
                {interestedUsers.length === 0 ? (
                  <p className="italic text-center">Brak zainteresowanych osób</p>
                ) : (
                  interestedUsers.map(user => (
                    <div
                      key={user.userId}
                      className="flex items-center mb-3 gap-4"
                    >
                      <img
                        src={user.photo || UserDefault}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-10 w-10 rounded-full"
                      />
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                      <div className="flex ml-auto gap-1">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-md p-1 text-sm text-grey-2 hover:text-red"
                          onClick={() => onRejectUser(user.userId)}
                        >
                          <CloseSharpIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-md p-1 text-sm text-grey-2 hover:text-green"
                          onClick={() => onAcceptUser(user.userId)}
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
      )}
    </Dialog>
  )
}

export default EventDialog
