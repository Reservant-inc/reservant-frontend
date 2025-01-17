import React, { useEffect, useState } from 'react'
import { ThreadType } from '../../../../../services/types'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import ConfirmationDialog from '../../../../reusableComponents/ConfirmationDialog'
import DeleteIcon from '@mui/icons-material/Delete'
import { FetchError } from '../../../../../services/Errors'
import { fetchDELETE } from '../../../../../services/APIconn'

interface ThreadPreviewProps {
  thread: ThreadType
  renderUserPhotos: Function
  handleThreadOpen: Function
  pressHandler: Function
  deleteThread: Function
}

const ThreadPreview: React.FC<ThreadPreviewProps> = ({
  thread,
  renderUserPhotos,
  handleThreadOpen,
  pressHandler,
  deleteThread
}) => {
  const [updatedThread, setUpdatedThread] = useState<ThreadType | null>(null)
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [isHovering, setIsHovering] = useState<boolean>(false)

  const [t] = useTranslation('global')

  useEffect(() => {
    const currentUserId = JSON.parse(Cookies.get('userInfo') as string).userId
    thread.participants = thread.participants.filter(
      participant => participant.userId !== currentUserId
    )
    setUpdatedThread(thread)
  }, [])

  return (
    <div
      className="flex items-center justify-between gap-2 w-full hover:bg-grey-0 dark:hover:bg-grey-5 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {updatedThread && (
        <>
          <button
            key={thread.threadId}
            className="w-full rounded-md p-2 dark:hover:bg-grey-5 text-left"
            onClick={() => {
              handleThreadOpen(thread)
              pressHandler()
            }}
          >
            <div className="flex gap-3 items-center">
              {renderUserPhotos(updatedThread)}
              <h1 className="text-sm dark:text-white">{thread.title}</h1>
            </div>
          </button>
          {isHovering && (
            <button
              className="hover:bg-grey-1 dark:hover:bg-grey-4 rounded-full p-1 mr-2"
              onClick={() => setIsPressed(true)}
            >
              <DeleteIcon className="dark:text-grey-1 hover:text-error w-5 h-5" />
            </button>
          )}
        </>
      )}
      <ConfirmationDialog
        open={isPressed}
        onClose={() => setIsPressed(false)}
        onConfirm={() => deleteThread(thread.threadId)}
        confirmationText={t('threads.delete')}
      />
    </div>
  )
}

export default ThreadPreview
