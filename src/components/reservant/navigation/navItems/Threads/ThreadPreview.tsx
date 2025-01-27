import React, { useEffect, useState } from 'react'
import { ThreadType } from '../../../../../services/types'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import ConfirmationDialog from '../../../../reusableComponents/ConfirmationDialog'
import DeleteIcon from '@mui/icons-material/Delete'
import { ThreadScope } from '../../../../../services/enums'

interface ThreadPreviewProps {
  thread: ThreadType
  renderUserPhotos: Function
  handleThreadOpen: Function
  pressHandler: Function
}

const ThreadPreview: React.FC<ThreadPreviewProps> = ({
  thread,
  renderUserPhotos,
  handleThreadOpen,
  pressHandler
}) => {
  const [updatedThread, setUpdatedThread] = useState<ThreadType | null>(null)

  const [t] = useTranslation('global')

  const otherUser = thread.participants.find(
    participant =>
      participant.userId !==
      JSON.parse(Cookies.get('userInfo') as string).userId
  )

  const threadTitle =
    (thread.type as ThreadScope) === ThreadScope.Private
      ? `${otherUser?.firstName} ${otherUser?.lastName}`
      : thread.title

  useEffect(() => {
    const currentUserId = JSON.parse(Cookies.get('userInfo') as string).userId
    if (thread.participants.length > 1) {
      thread.participants = thread.participants.filter(
        participant => participant.userId !== currentUserId
      )
    }
    setUpdatedThread(thread)
  }, [])

  return (
    <div className="flex items-center justify-between gap-2 w-full hover:bg-grey-0 dark:hover:bg-grey-5 relative">
      {updatedThread && (
        <>
          <button
            key={thread.threadId}
            className="w-full rounded-md p-2 dark:hover:bg-grey-5 text-left"
            onClick={() => {
              handleThreadOpen({ ...updatedThread, title: threadTitle })
              pressHandler()
            }}
          >
            <div className="flex gap-3 items-center">
              {renderUserPhotos(updatedThread)}
              <h1 className="text-sm dark:text-white">{threadTitle}</h1>
            </div>
          </button>
        </>
      )}
    </div>
  )
}

export default ThreadPreview
