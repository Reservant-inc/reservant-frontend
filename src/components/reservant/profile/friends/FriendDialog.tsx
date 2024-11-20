import React from 'react'
import Dialog from '../../../reusableComponents/Dialog'
import { useTranslation } from 'react-i18next'

interface FriendDialogProps {
  isOpen: boolean
  friendName: string
  onClose: () => void
  onConfirm: () => void
}

const FriendDialog: React.FC<FriendDialogProps> = ({
  isOpen,
  friendName,
  onClose,
  onConfirm
}) => {

    const [t] = useTranslation('global')

  if (!isOpen) return null // Nie renderuj jeśli dialog jest zamknięty

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="" // Opcjonalnie można dodać jakieś jeśli będie potrzeba dodawania róznych rzeczy w Dialogu. Na razie jest tylko to
    >
      <div className='p-2 dark:text-white'>
        <p>
          {t('profile.friends.friend-removal-dialog-1')}<strong>{friendName}</strong>{t('profile.friends.friend-removal-dialog-2')}
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            id="FriendRemovalConfirmationButton"
            onClick={onConfirm}
            className="rounded-lg border-[1px] px-4 py-2 bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black dark:border-secondary dark:text-secondary dark:bg-grey-5"
          >
            {t('profile.friends.removal-accept')}
          </button>
          <button
            id="FriendRemovalDeclineButton"
            onClick={onClose}
            className="rounded-lg border-[1px] px-4 py-2 bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black dark:border-secondary dark:text-secondary dark:bg-grey-5"
          >
            {t('profile.friends.removal-decline')}
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default FriendDialog
