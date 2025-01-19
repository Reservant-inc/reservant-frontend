import React, { ReactNode, useEffect, useRef } from 'react'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { createPortal } from 'react-dom'

interface PopupProps {
  children: ReactNode
  open?: boolean
  onClose: () => void
  title?: string
}

const Dialog: React.FC<PopupProps> = ({ open, children, onClose, title }) => {
  const dialog = useRef<HTMLDialogElement>(null)
  const div = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      dialog.current?.showModal()
    } else {
      dialog.current?.close()
    }
  }, [open])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialog.current &&
        div.current &&
        !div.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onClose])

  return open
    ? createPortal(
        <dialog
          ref={dialog}
          onClose={() => onClose()}
          className="h-full w-full bg-trans flex items-center justify-center overflow-y-hidden z-[1]"
        >
          <div
            ref={div}
            className="min-h-[100px] max-h-[95vh] min-w-[100px] dark:bg-black bg-white rounded-lg"
          >
            {title && (
              <div className="h-[2.25rem] py-1 px-4 flex justify-between items-center dark:bg-black bg-white rounded-t-lg border-b-[1px] border-grey-1 dark:border-grey-4">
                <h1 className="font-mont-md text-sm text-black dark:text-grey-1">
                  {title}
                </h1>
                <button
                  className="h-8 w-8 bg-white dark:bg-black dark:text-grey-1 rounded-full top-0 right-2"
                  onClick={() => onClose()}
                >
                  <CloseSharpIcon className="h-6 w-6 dark:text-white" />
                </button>
              </div>
            )}
            {children}
          </div>
        </dialog>,
        document.getElementById('modal') || document.body
      )
    : null
}

export default Dialog
