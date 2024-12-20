import React from 'react';
import Dialog from '../../../reusableComponents/Dialog';

interface AddIngredientDialogProps {
  open: boolean;
  onClose: () => void;
  formValues: {
    name: string;
    unitOfMeasurement: string;
    minimalAmount: string;
    amount: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAddIngredient: () => void;
  t: (key: string) => string; 
}

const AddIngredientDialog: React.FC<AddIngredientDialogProps> = ({
  open,
  onClose,
  formValues,
  onFormChange,
  onAddIngredient,
  t,
}) => {

    if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('warehouse.add-ingredient')}
    >
      <div className="p-4 flex flex-col gap-3 text-black dark:text-white">
        <label className="text-sm">{t('warehouse.new-name')}</label>
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={onFormChange}
          className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
          required
        />
        <label className="text-sm">{t('warehouse.new-unit')}</label>
        <select
          name="unitOfMeasurement"
          value={formValues.unitOfMeasurement}
          onChange={onFormChange}
          className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
        >
          <option value="Gram">Gram</option>
          <option value="Liter">Liter</option>
          <option value="Unit">Unit</option>
        </select>
        <label className="text-sm">{t('warehouse.new-minimal')}</label>
        <input
          type="number"
          name="minimalAmount"
          value={formValues.minimalAmount}
          onChange={onFormChange}
          className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
          required
        />
        <label className="text-sm">{t('warehouse.new-amount')}</label>
        <input
          type="number"
          name="amount"
          value={formValues.amount}
          onChange={onFormChange}
          className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
        />
        <div className="flex justify-end gap-4 mt-4">
          <button
            id='CancelAddIngredientDialog'
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            onClick={onClose}
          >
            {t('warehouse.new-cancel')}
          </button>
          <button
            id='SubmitAddIngredientDialog'
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            onClick={onAddIngredient}
          >
            {t('warehouse.new-add')}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddIngredientDialog;
