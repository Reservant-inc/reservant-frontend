import React from 'react';
import Dialog from '../../../reusableComponents/Dialog';
import { useTranslation } from 'react-i18next';

const GroceryInfoDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  message: string;
  fetchIngredients: () => void;
}> = ({ open, onClose, message, fetchIngredients }) => {
  const [t] = useTranslation('global')
    if (!open) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('warehouse.delivery-confirmation-title')}
    >
      <div className="p-4 flex flex-col gap-4">
        <p className="text-black dark:text-white">{message}</p>
        <div className="flex justify-end">
          <button
            id='GroceryInfoDialogConfirmation'
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            onClick={() => {
              onClose();
              fetchIngredients();
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default GroceryInfoDialog;
