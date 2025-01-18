import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IngredientType } from '../../../../services/types';
import Dialog from '../../../reusableComponents/Dialog';
import { fetchPOST } from '../../../../services/APIconn';
import { useTranslation } from 'react-i18next';

interface EditQuantityDialogProps {
  open: boolean;
  onClose: () => void;
  ingredient: IngredientType | null;
  onUpdate: () => void;
}

const EditQuantityDialog: React.FC<EditQuantityDialogProps> = ({
  open,
  onClose,
  ingredient,
  onUpdate,
}) => {
  const [t] = useTranslation('global');

  if (!open || !ingredient) return null;

  const validationSchema = Yup.object({
    currentAmount: Yup.number().min(0).required(t('warehouse.required')),
    comment: Yup.string()
      .required(t('warehouse.required'))
      .test(
        'not-empty-or-spaces',
        t('warehouse.comment-cannot-be-empty'),
        (value) => !!value && value.trim().length > 0
      ),
  });

  const handleSubmit = async (values: { currentAmount: number; comment: string }) => {
    try {
      const payload = {
        newAmount: values.currentAmount,
        comment: values.comment.trim(), 
      };
      await fetchPOST(`/ingredients/${ingredient.ingredientId}/correct-amount`, JSON.stringify(payload));
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={t('warehouse.edit-quantity')}>
      <Formik
        initialValues={{
          currentAmount: ingredient.amount,
          comment: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty }) => (
          <Form className="p-4 w-[350px]">
            <div className="mt-4 flex flex-col gap-3">
              <label className="text-sm text-black dark:text-white">{t('warehouse.edit-current-amount')}</label>
              <Field
                type="number"
                name="currentAmount"
                min={0}
                className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white"
              />
              <ErrorMessage name="currentAmount" component="div" className="text-red text-sm" />
              <label className="text-sm text-black dark:text-white">{t('warehouse.edit-comment')}</label>
              <Field
                as="textarea"
                name="comment"
                className="w-full rounded border border-grey-2 p-2 dark:bg-grey-5 dark:text-white resize-none"
              />
              <ErrorMessage name="comment" component="div" className="text-red text-sm" />
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
                {t('warehouse.save')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditQuantityDialog;
