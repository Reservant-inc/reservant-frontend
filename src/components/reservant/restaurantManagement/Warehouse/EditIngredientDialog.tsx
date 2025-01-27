import React from 'react';
import { IngredientType } from '../../../../services/types';
import Dialog from '../../../reusableComponents/Dialog';
import { fetchPUT } from '../../../../services/APIconn';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface EditIngredientDialogProps {
  open: boolean;
  onClose: () => void;
  ingredient: IngredientType | null;
  onUpdate: () => void; // Aktualizacja składników
}

const EditIngredientDialog: React.FC<EditIngredientDialogProps> = ({
  open,
  onClose,
  ingredient,
  onUpdate,
}) => {
  const [t] = useTranslation('global');

  if (!open || !ingredient) return null;

  const validationSchema = Yup.object({
    publicName: Yup.string()
      .required(t('errors.add-ingredient.publicName.required'))
      .max(20, t('errors.add-ingredient.publicName.max')),
    unitOfMeasurement: Yup.string()
      .required(t('errors.add-ingredient.unit.required')),
    minimalAmount: Yup.number()
      .required(t('errors.add-ingredient.minimalAmount.required'))
      .min(0, t('errors.add-ingredient.minimalAmount.min')),
    amountToOrder: Yup.number()
      .required(t('errors.add-ingredient.amountToOrder.required'))
      .min(0, t('errors.add-ingredient.amount.min')),
  });

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        publicName: values.publicName,
        unitOfMeasurement: values.unitOfMeasurement,
        minimalAmount: values.minimalAmount,
        amountToOrder: values.amountToOrder,
      };
      await fetchPUT(`/ingredients/${ingredient.ingredientId}/`, JSON.stringify(payload));
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating ingredient:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={t('warehouse.edit-ingredient')}>
      <Formik
        initialValues={{
          publicName: ingredient.publicName,
          unitOfMeasurement: ingredient.unitOfMeasurement,
          minimalAmount: ingredient.minimalAmount,
          amountToOrder: ingredient.amountToOrder || 0,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty, errors, touched }) => (
          <Form className="p-4 flex flex-col gap-3 text-black dark:text-white">
            <div>
              <div
                className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                  errors.publicName && touched.publicName
                    ? 'border-error text-error'
                    : 'border-black dark:border-white'
                }`}
              >
                <label htmlFor="publicName">{t('warehouse.edit-name')}</label>
                <Field
                  type="text"
                  id="publicName"
                  name="publicName"
                  className="w-full border-none dark:bg-black"
                />
                <label>*</label>
              </div>
              <ErrorMessage name="publicName" component="div" className="text-red text-sm" />
            </div>

            <div>
              <div
                className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                  errors.unitOfMeasurement && touched.unitOfMeasurement
                    ? 'border-error text-error'
                    : 'border-black dark:border-white'
                }`}
              >
                <label htmlFor="unitOfMeasurement">{t('warehouse.edit-unit')}</label>
                <Field
                  as="select"
                  id="unitOfMeasurement"
                  name="unitOfMeasurement"
                  className="w-full border-none dark:bg-black"
                >
                  <option value="Gram">{t('warehouse.gram')}</option>
                  <option value="Liter">{t('warehouse.liter')}</option>
                  <option value="Unit">{t('warehouse.unit-unit')}</option>
                </Field>
                <label>*</label>
              </div>
              <ErrorMessage name="unitOfMeasurement" component="div" className="text-red text-sm" />
            </div>

            <div>
              <div
                className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                  errors.minimalAmount && touched.minimalAmount
                    ? 'border-error text-error'
                    : 'border-black dark:border-white'
                }`}
              >
                <label htmlFor="minimalAmount">{t('warehouse.edit-minimal-amount')}</label>
                <Field
                  type="number"
                  id="minimalAmount"
                  name="minimalAmount"
                  className="w-full border-none dark:bg-black"
                  min={0}
                />
                <label>*</label>
              </div>
              <ErrorMessage name="minimalAmount" component="div" className="text-red text-sm" />
            </div>

            <div>
              <div
                className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                  errors.amountToOrder && touched.amountToOrder
                    ? 'border-error text-error'
                    : 'border-black dark:border-white'
                }`}
              >
                <label htmlFor="amountToOrder">{t('warehouse.edit-amount-to-order')}</label>
                <Field
                  type="number"
                  id="amountToOrder"
                  name="amountToOrder"
                  className="w-full border-none dark:bg-black"
                  min={0}
                />
                <label>*</label>
              </div>
              <ErrorMessage name="amountToOrder" component="div" className="text-red text-sm" />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              >
                {t('warehouse.new-cancel')}
              </button>
              <button
                type="submit"
                disabled={!isValid || !dirty}
                className={`flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
              >
                {t('warehouse.save')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditIngredientDialog;
