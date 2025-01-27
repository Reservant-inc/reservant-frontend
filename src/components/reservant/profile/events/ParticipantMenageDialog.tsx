import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Tooltip from '@mui/material/Tooltip'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import CheckSharpIcon from '@mui/icons-material/CheckSharp'
import { InterestedUser } from '../../../../services/types'
import UserDefault from '../../../../assets/images/user.jpg'
import { useTranslation } from 'react-i18next'
import { getImage } from '../../../../services/APIconn'

interface ParticipantMenageDialogProps {
  open: boolean
  onClose: () => void
  participants: InterestedUser[]
  interestedUsers: InterestedUser[]
  onAcceptUser: (userId: string) => void
  onRejectUser: (userId: string) => void
  mustJoinUntil?: string | null
  maxPeople?: number // Dodano pole `maxPeople`
}

const ParticipantMenageDialog: React.FC<ParticipantMenageDialogProps> = ({
  open,
  onClose,
  participants,
  interestedUsers,
  onAcceptUser,
  onRejectUser,
  mustJoinUntil,
  maxPeople
}) => {
  const [t] = useTranslation('global')

  // Check if the current date is past mustJoinUntil
  const isPastDeadline = mustJoinUntil
    ? new Date() > new Date(mustJoinUntil)
    : false

  // Check if the maxPeople limit has been reached
  const isLimitReached =
    maxPeople !== undefined && participants.length >= maxPeople

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        className: 'bg-white dark:bg-black'
      }}
    >
      <DialogTitle className="flex justify-between items-center font-bold border-b border-grey-1 dark:text-white">
        <span>{t('ParticipantManageDialog.manageParticipants')}</span>
        <button onClick={onClose} className="text-grey-2">
          <CloseSharpIcon />
        </button>
      </DialogTitle>
      <DialogContent>
        <div className="flex space-x-4 py-5">
          {/* Participants Column */}
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1 dark:text-white">
              {t('ParticipantManageDialog.participants')}{' '}
              <span className="text-grey-3">({participants.length})</span>
            </h2>
            <div className="space-y-4 dark:text-white">
              {participants.map(user => (
                <div key={user.userId} className="flex items-center space-x-4">
                  <img
                    src={getImage(user.photo, UserDefault)}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-10 w-10 rounded-full"
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interested Users Column */}
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1 dark:text-white">
              {t('ParticipantManageDialog.interested')}{' '}
              <span className="text-grey-3">({interestedUsers.length})</span>
            </h2>
            <div className="space-y-4">
              {interestedUsers.map(user => (
                <div
                  key={user.userId}
                  className="flex items-center space-x-4 dark:text-white"
                >
                  <img
                    src={getImage(user.photo, UserDefault)}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-10 w-10 rounded-full "
                  />
                  <div className="flex space-x-5">
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                    <div className="flex space-x-4">
                      {/* Accept button */}
                      <Tooltip
                        title={
                          isPastDeadline
                            ? t('ParticipantManageDialog.pastAcceptTime')
                            : isLimitReached
                              ? t('ParticipantManageDialog.participantLimit')
                              : t('ParticipantManageDialog.acceptParticipant')
                        }
                      >
                        <button
                          className={` ${
                            isPastDeadline || isLimitReached
                              ? 'text-grey-3'
                              : 'text-primary'
                          }`}
                          onClick={() =>
                            !isPastDeadline &&
                            !isLimitReached &&
                            onAcceptUser(user.userId)
                          }
                          disabled={isPastDeadline || isLimitReached}
                        >
                          <CheckSharpIcon />
                        </button>
                      </Tooltip>
                      {/* Reject button */}
                      <Tooltip title={t('ParticipantManageDialog.decline')}>
                        <button
                          className="text-danger"
                          onClick={() => onRejectUser(user.userId)}
                        >
                          <CloseSharpIcon />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ParticipantMenageDialog
