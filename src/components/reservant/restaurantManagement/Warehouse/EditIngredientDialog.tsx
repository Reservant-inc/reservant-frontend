import React from 'react';
import { IngredientType } from '../../../../services/types';
import Dialog from '../../../reusableComponents/Dialog';
import { fetchPUT } from '../../../../services/APIconn';
import { UnitOfMeasurement } from '../../../../services/enums';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface EditIngredientDialogProps {
  open: boolean;
  onClose: () => void;
  ingredient: IngredientType | null;
  onUpdate: () => void; // aktualizacja skladnikow
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
    publicName: Yup.string().required(t('warehouse.required')),
    unitOfMeasurement: Yup.string().required(t('warehouse.required')),
    minimalAmount: Yup.number().min(0).required(t('warehouse.required')),
    amountToOrder: Yup.number().min(0).required(t('warehouse.required')),
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
          unitOfMeasurement: UnitOfMeasurement[ingredient.unitOfMeasurement],
          minimalAmount: ingredient.minimalAmount,
          amountToOrder: ingredient.amountToOrder || 0,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty }) => (
          <Form className="p-4 w-[350px]">
            <p className="text-black dark:text-white mb-4">
              {t('warehouse.editing')}: <span className="font-mont-bd">{ingredient.publicName}</span>
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <label className="text-sm text-black dark:text-white">{t('warehouse.edit-name')}</label>
              <Field
                type="text"
                name="publicName"
                className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
              />
              <ErrorMessage
                name="publicName"
                component="div"
                className="text-red text-sm"
              />

              <label className="text-sm text-black dark:text-white">{t('warehouse.edit-unit')}</label>
              <Field
                as="select"
                name="unitOfMeasurement"
                className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
              >
                <option value="Gram">{t("warehouse.gram")}</option>
                <option value="Liter">{t("warehouse.liter")}</option>
                <option value="Unit">{t("warehouse.unit-unit")}</option>
              </Field>
              <ErrorMessage
                name="unitOfMeasurement"
                component="div"
                className="text-red text-sm"
              />

              <label className="text-sm text-black dark:text-white">{t('warehouse.edit-minimal-amount')}</label>
              <Field
                type="number"
                name="minimalAmount"
                min={0}
                className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
              />
              <ErrorMessage
                name="minimalAmount"
                component="div"
                className="text-red text-sm"
              />

              <label className="text-sm text-black dark:text-white">{t('warehouse.edit-amount-to-order')}</label>
              <Field
                type="number"
                name="amountToOrder"
                min={0}
                className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
              />
              <ErrorMessage
                name="amountToOrder"
                component="div"
                className="text-red text-sm"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={!isValid || !dirty}
                className={`px-4 py-2 rounded ${
                  isValid && dirty
                    ? 'bg-primary text-white hover:bg-primary-2'
                    : 'bg-grey-2 text-grey-5 cursor-not-allowed opacity-50'
                } dark:bg-secondary dark:hover:bg-secondary-2`}
              >
                {t('warehouse.edit-ingredient')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditIngredientDialog;
