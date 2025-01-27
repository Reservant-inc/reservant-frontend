import React from 'react';
import Dialog from '../../../reusableComponents/Dialog';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SaveOutlined } from '@mui/icons-material';
import ErrorMes from '../../../reusableComponents/ErrorMessage';

interface AddIngredientDialogProps {
  open: boolean;
  onClose: () => void;
  onAddIngredient: (values: {
    publicName: string;
    unitOfMeasurement: string;
    minimalAmount: number;
    amount?: number;
  }) => Promise<void>;
  t: (key: string) => string;
}

const AddIngredientDialog: React.FC<AddIngredientDialogProps> = ({
  open,
  onClose,
  onAddIngredient,
  t,
}) => {
  const validationSchema = Yup.object({
    publicName: Yup.string()
      .required(t('errors.add-ingredient.publicName.required'))
      .max(20, t('errors.add-ingredient.publicName.max')),
    unitOfMeasurement: Yup.string()
      .required(t('errors.add-ingredient.unit.required')),
    minimalAmount: Yup.number()
      .required(t('errors.add-ingredient.minimalAmount.required'))
      .min(0, t('errors.add-ingredient.minimalAmount.min')),
    amount: Yup.number()
      .optional()
      .min(0, t('errors.add-ingredient.amount.min')),
  });

  const initialValues = {
    publicName: '',
    unitOfMeasurement: '',
    minimalAmount: 0,
    amount: undefined,
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} title={t('warehouse.add-ingredient')}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onAddIngredient(values);
            onClose();
          } catch (error) {
            console.error('Error adding ingredient:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {formik => (
          <Form className="p-4 flex flex-col gap-3 text-black dark:text-white">
            <div>
              <div
                className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                  formik.errors.publicName && formik.touched.publicName
                    ? 'border-error text-error'
                    : 'border-black text-black dark:text-grey-1 dark:border-white'
                }`}
              >
                <label htmlFor="publicName">{t('warehouse.new-name')}</label>
                <Field
                  type="text"
                  id="publicName"
                  name="publicName"
                  className="w-full"
                />
                <label>*</label>
              </div>
              {formik.errors.publicName && formik.touched.publicName && (
                <ErrorMes msg={formik.errors.publicName} />
              )}
            </div>
            <div>
              <div
                className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                  formik.errors.unitOfMeasurement &&
                  formik.touched.unitOfMeasurement
                    ? 'border-error text-error'
                    : 'border-black text-black dark:text-grey-1 dark:border-white'
                }`}
              >
                <label htmlFor="unitOfMeasurement">
                  {t('warehouse.new-unit')}
                </label>
                <Field
                  id="unitOfMeasurement"
                  name="unitOfMeasurement"
                  as="select"
                  className="border-none w-full dark:bg-black"
                >
                  <option
                    className="dark:text-white dark:bg-black"
                    value=""
                    disabled
                  >
                    {t('warehouse.select-unit')}
                  </option>
                  <option value="Gram">{t('warehouse.gram')}</option>
                  <option value="Liter">{t('warehouse.liter')}</option>
                  <option value="Unit">{t('warehouse.unit-unit')}</option>
                </Field>
                <label>*</label>
              </div>
              {formik.errors.unitOfMeasurement &&
                formik.touched.unitOfMeasurement && (
                  <ErrorMes msg={formik.errors.unitOfMeasurement} />
                )}
            </div>
            <div>
              <div
                className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                  formik.errors.minimalAmount && formik.touched.minimalAmount
                    ? 'border-error text-error'
                    : 'border-black text-black dark:text-grey-1 dark:border-white'
                }`}
              >
                <label htmlFor="minimalAmount">
                  {t('warehouse.new-minimal')}
                </label>
                <Field
                  type="number"
                  id="minimalAmount"
                  name="minimalAmount"
                  className="w-full dark:[color-scheme:dark]"
                />
                <label>*</label>
              </div>
              {formik.errors.minimalAmount &&
                formik.touched.minimalAmount && (
                  <ErrorMes msg={formik.errors.minimalAmount} />
                )}
            </div>
            <div>
              <div
                className={`flex items-center justify-start gap-1 border-b-[1px] text-nowrap ${
                  formik.errors.amount && formik.touched.amount
                    ? 'border-error text-error'
                    : 'border-black text-black dark:text-grey-1 dark:border-white'
                }`}
              >
                <label htmlFor="amount">{t('warehouse.new-amount')}</label>
                <Field
                  type="number"
                  id="amount"
                  name="amount"
                  className="w-full dark:[color-scheme:dark]"
                />
              </div>
              {formik.errors.amount && formik.touched.amount && (
                <ErrorMes msg={formik.errors.amount} />
              )}
            </div>
            <div className="flex justify-end gap-4">
              <button
                id="CancelAddIngredientDialog"
                className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                onClick={onClose}
                type="button"
              >
                {t('warehouse.new-cancel')}
              </button>
              <button
                id="SubmitAddIngredientDialog"
                className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
                type="submit"
                disabled={!formik.isValid || !formik.dirty}
              >
                <SaveOutlined />
                {t('warehouse.new-add')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddIngredientDialog;
