import React, { ReactNode } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import { useTranslation } from 'react-i18next'

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('general.confirmation')}</DialogTitle>
      <DialogContent>{confirmationText}</DialogContent>
      <DialogActions>
        {(onAlt || altText) && (
          <Button onClick={onAlt} color="error" id="ConfirmationAlt">
            {altText}
          </Button>
        )}
        <Button onClick={onClose} color="error" id="ConfirmationCancel">
          {t('general.cancel')}
        </Button>
        <Button onClick={handleConfirm} color="primary" id="ConfirmationConfirm">
          {t('general.yes')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
