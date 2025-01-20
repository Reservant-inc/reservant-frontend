import React, { ReactNode } from 'react'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Dialog from './Dialog'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  confirmationText: string
  onAlt?: () => void
  altText?: string
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onAlt,
  altText,
  confirmationText
}) => {
  const [t] = useTranslation('global')
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }
  return (
    <Dialog open={open} onClose={onClose} title={t('general.confirmation')}>
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-md dark:text-white">{confirmationText}</h1>
        <div className="flex gap-2 self-end">
          {(onAlt || altText) && (
            <Button onClick={onAlt} color="error" id="ConfirmationAlt">
              {altText}
            </Button>
          )}
          <Button onClick={onClose} color="error" id="ConfirmationCancel">
            {t('general.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            id="ConfirmationConfirm"
          >
            {t('general.yes')}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmationDialog
