import React, { useState, useEffect } from 'react';
import { IngredientType } from '../../../../services/types';
import Dialog from '../../../reusableComponents/Dialog';
import { fetchPOST, fetchPUT } from '../../../../services/APIconn';
import { UnitOfMeasurement } from '../../../../services/enums';

interface EditIngredientDialogProps {
  open: boolean;
  onClose: () => void;
  ingredient: IngredientType | null;
  onUpdate: () => void; // do uaktualniania listy ingredientów
}

const EditIngredientDialog: React.FC<EditIngredientDialogProps> = ({
  open,
  onClose,
  ingredient,
  onUpdate,
}) => {
  const [isQuantityOnly, setIsQuantityOnly] = useState(true);
  const [formValues, setFormValues] = useState({
    publicName: '',
    unitOfMeasurement: 'Gram',
    minimalAmount: 0,
    amountToOrder: 0,
    currentAmount: 0,
    comment: '',
  });

  useEffect(() => {
    if (open && ingredient) {
        setFormValues({
            publicName: ingredient.publicName,
            unitOfMeasurement: UnitOfMeasurement[ingredient.unitOfMeasurement], // konwersja na stringa
            minimalAmount: ingredient.minimalAmount,
            amountToOrder: ingredient.amountToOrder || 0,
            currentAmount: ingredient.amount,
            comment: '',
          });
          
    }
  }, [open, ingredient]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === 'minimalAmount' || name === 'amountToOrder' || name === 'currentAmount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!ingredient) return;

    if (isQuantityOnly) {
      const payload = {
        newAmount: formValues.currentAmount,
        comment: formValues.comment,
      };

      try {
        await fetchPOST(
          `/ingredients/${ingredient.ingredientId}/correct-amount`,
          JSON.stringify(payload)
        );
      } catch (error) {
        console.error('Error updating amount:', error);
      }
    } else {
      const payload = {
        publicName: formValues.publicName,
        unitOfMeasurement: formValues.unitOfMeasurement,
        minimalAmount: formValues.minimalAmount,
        amountToOrder: formValues.amountToOrder,
      };

      try {
        await fetchPUT(`/ingredients/${ingredient.ingredientId}/`, JSON.stringify(payload));
      } catch (error) {
        console.error('Error updating ingredient:', error);
      }
    }

    onUpdate(); // aktualizacja składników
    onClose(); // zamykam dialog
  };

  if (!open) return null; 

  return (
    <Dialog open={open} onClose={onClose} title="Edit Ingredient">
      <div className="p-4">
        {ingredient ? (
          <>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="quantityOnly"
                checked={isQuantityOnly}
                onChange={() => setIsQuantityOnly(!isQuantityOnly)}
                className="mr-2 h-5 w-5 border border-primary dark:border-secondary focus:ring-primary dark:focus:ring-secondary checked:bg-primary dark:checked:bg-secondary"
              />
              <label htmlFor="quantityOnly" className="text-black dark:text-white">
                Tylko ilość
              </label>
            </div>
            <p className="text-black dark:text-white mb-4">
              Editing: <strong>{ingredient.publicName}</strong>
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {isQuantityOnly ? (
                <>
                  <label className="text-sm text-black dark:text-white">Current Amount</label>
                  <input
                    type="number"
                    name="currentAmount"
                    min={0}
                    value={formValues.currentAmount}
                    onChange={handleInputChange}
                    className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
                  />
                  <label className="text-sm text-black dark:text-white">Comment</label>
                  <textarea
                    name="comment"
                    value={formValues.comment}
                    onChange={handleInputChange}
                    placeholder="Optional comment"
                    className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white resize-none"
                  />
                </>
              ) : (
                <>
                  <label className="text-sm text-black dark:text-white">Name</label>
                  <input
                    type="text"
                    name="publicName"
                    value={formValues.publicName}
                    onChange={handleInputChange}
                    className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
                  />
                  <label className="text-sm text-black dark:text-white">Unit of Measurement</label>
                  <select
                    name="unitOfMeasurement"
                    value={formValues.unitOfMeasurement}
                    onChange={handleInputChange}
                    className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
                  >
                    <option value="Gram">Gram</option>
                    <option value="Liter">Liter</option>
                    <option value="Unit">Unit</option>
                  </select>
                  <label className="text-sm text-black dark:text-white">Minimal Amount</label>
                  <input
                    type="number"
                    name="minimalAmount"
                    min={0}
                    value={formValues.minimalAmount}
                    onChange={handleInputChange}
                    className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
                  />
                  <label className="text-sm text-black dark:text-white">Amount to Order</label>
                  <input
                    type="number"
                    name="amountToOrder"
                    min={0}
                    value={formValues.amountToOrder}
                    onChange={handleInputChange}
                    className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
                  />
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-2 dark:bg-secondary dark:hover:bg-secondary-2"
              >
                {isQuantityOnly ? 'Edytuj' : 'Edytuj składnik'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-black dark:text-white">No ingredient selected.</p>
        )}
      </div>
    </Dialog>
  );
};

export default EditIngredientDialog;
