import React, { useState } from 'react'
import { ThreadType } from '../../../../../services/types'
import { Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'

interface threadProps {
  thread: ThreadType
  handleThreadMaximize: Function
  renderUserPhotos: Function
  handleThreadClose: Function
}

const InactiveThread: React.FC<threadProps> = ({
  thread,
  handleThreadMaximize,
  handleThreadClose,
  renderUserPhotos
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false)

  return (
    <Tooltip title={`${thread.title}`} placement="left" arrow>
      <div
        key={thread.threadId}
        className="relative flex items-center justify-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <button onClick={() => handleThreadMaximize(thread)}>
          {renderUserPhotos(thread)}
        </button>
        {isHovering && (
          <button
            className="absolute right-0 top-0 flex bg-black text-white fade-in-render rounded-full w-4 h-4 justify-center items-center p-0"
            onClick={() => handleThreadClose(thread)}
          >
            <CloseIcon className="h-3 w-3 p-0" />
          </button>
        )}
      </div>
    </Tooltip>
  )
}

export default InactiveThread
