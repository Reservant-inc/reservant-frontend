import React, { useState, useEffect } from 'react';
import Dialog from '../../reusableComponents/Dialog';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { fetchPOST, fetchPUT, fetchGET } from '../../../services/APIconn';
import { useTranslation } from 'react-i18next';
import { ResolveFormValues } from '../../../services/types';

interface ReportActionDialogProps {
  open: boolean;
  onClose: () => void;
  actionType?: 'assign' | 'resolve';
  reportId: number;
  refreshReports: () => void;
}

const ReportActionDialog: React.FC<ReportActionDialogProps> = ({
  open,
  onClose,
  actionType,
  reportId,
  refreshReports,
}) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [t] = useTranslation('global');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetchGET('/users/fced96c1-dad9-49ff-a598-05e1c5e433aa');
        setAgents([response]); 
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    if (open && actionType === 'assign') {
      fetchAgents();
    }
  }, [open, actionType]);

  const assignValidationSchema = Yup.object({
    agentId: Yup.string().required(t('customer-service.report-details.agent-required')),
  });

  const resolveValidationSchema = Yup.object({
    comment: Yup.string()
      .required(t('customer-service.report-details.comment-required'))
      .min(3, t('customer-service.report-details.comment-min')),
    isResolutionPositive: Yup.boolean()
      .nullable()
      .required(t('customer-service.report-details.resolution-required')),
  });

  const handleAssignSubmit = async (values: { agentId: string }) => {
    try {
      const body = JSON.stringify({ agentId: values.agentId });
      await fetchPOST(`/reports/${reportId}/assign-to`, body);
      setSuccessMessage(t('customer-service.report-details.assign-success'));
      refreshReports();
    } catch (error) {
      console.error('Error assigning agent:', error);
    }
  };

  const handleResolveSubmit = async (values: ResolveFormValues) => {
    try {
      const body = JSON.stringify({
        supportComment: values.comment,
        isResolutionPositive: values.isResolutionPositive,
      });
      await fetchPUT(`/reports/${reportId}/resolution`, body);
      refreshReports();
      onClose();
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        actionType === 'assign'
          ? t('customer-service.report-details.assign-agent')
          : t('customer-service.report-details.resolve-complaint')
      }
    >
      {successMessage ? (
        <div className="p-4 dark:text-white">
        <p className="font-mont-bd text-lg">{successMessage}</p>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 border-primary bg-white hover:bg-primary hover:text-white border-[1px] rounded-md"
            onClick={() => {
              setSuccessMessage(null); 
              onClose();
            }}
          >
            {t('customer-service.report-details.ok')}
          </button>
        </div>
      </div>
      ) : actionType === 'assign' ? (
        <Formik
          initialValues={{ agentId: '' }}
          validationSchema={assignValidationSchema}
          onSubmit={handleAssignSubmit}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form className="p-4 flex flex-col gap-4 w-[400px] dark:text-white">
              <label htmlFor="agentId" className="font-mont-md text-sm">
                {t('customer-service.report-details.select-agent')}
              </label>
              <Field
                as="select"
                name="agentId"
                id="agentId"
                className={`w-full cursor-pointer border ${
                  errors.agentId && touched.agentId ? 'border-red' : 'border-primary dark:border-secondary'
                } rounded-md`}
              >
                <option value="" className=''>
                  {t('customer-service.report-details.no-agent-selected')}
                </option>
                {agents.map((agent) => (
                  <option key={agent.userId} value={agent.userId}>
                    {agent.firstName} {agent.lastName}
                  </option>
                ))}
              </Field>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 dark:text-secondary dark:bg-black dark:border-secondary dark:hover:bg-secondary dark:hover:text-white text-primary border-primary bg-white hover:bg-primary hover:text-white border-[1px] rounded-md"
                >
                  {t('customer-service.report-details.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!isValid || !dirty}
                  className={`px-4 py-2 text-primary dark:border-secondary dark:bg-black dark:text-secondary dark:hover:bg-secondary dark:hover:text-white border-primary bg-white hover:bg-primary hover:text-white border-[1px] rounded-md ${
                    !isValid || !dirty ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {t('customer-service.report-details.assign')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik<ResolveFormValues>
  initialValues={{ comment: '', isResolutionPositive: null }}
  validationSchema={resolveValidationSchema}
  onSubmit={(values) => {
    handleResolveSubmit(values);
  }}
>
  {({ errors, touched, isValid, dirty, setFieldValue, values }) => (
    <Form>
      <div className="w-[470px] h-[350px] p-4 gap-3 flex flex-col dark:text-white">
        <p className="font-mont-bd text-xl">
          {t('customer-service.report-details.resolve-comment')}
        </p>
        <div className="flex-grow">
          <Field
            type="text"
            name="comment"
            as="textarea"
            placeholder={t('customer-service.report-details.comment-placeholder')}
            rows="4"
            className={`w-full p-2 border dark:text-white dark:bg-grey-6 ${
              errors.comment && touched.comment ? 'border-red' : 'border-primary dark:border-secondary'
            } rounded-md`}
          />
          {errors.comment && touched.comment && (
            <p className="text-red text-sm">{errors.comment}</p>
          )}
        </div>
        <div>
          <p className="font-mont-md text-sm mb-2">
            {t('customer-service.report-details.resolve-success')}
          </p>
          <div role="group" aria-labelledby="is-resolution-positive-group">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isResolutionPositive"
                value="true"
                checked={values.isResolutionPositive === true}
                onChange={() => setFieldValue('isResolutionPositive', true)}
                className="cursor-pointer dark:border-secondary border-primary"
              />
              {t('customer-service.report-details.yes')}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isResolutionPositive"
                value="false"
                checked={values.isResolutionPositive === false}
                onChange={() => setFieldValue('isResolutionPositive', false)}
                className="cursor-pointer"
              />
              {t('customer-service.report-details.no')}
            </label>
          </div>
          {errors.isResolutionPositive && touched.isResolutionPositive && (
            <p className="text-red text-sm">{errors.isResolutionPositive}</p>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="hover:scale-105 transition px-3 py-1 border-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md bg-white text-primary"
          >
            {t('customer-service.report-details.cancel')}
          </button>
          <button
            type="submit"
            disabled={!isValid || !dirty}
            className={`border-[1px] rounded-md p-1 ${
              isValid && dirty
                ? 'dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black border-primary text-primary hover:bg-primary hover:text-white hover:scale-105 transition'
                : 'border-grey-5 text-grey-5 cursor-not-allowed opacity-50 '
            }`}
          >
            {t('customer-service.report-details.resolve')}
          </button>
        </div>
      </div>
    </Form>
  )}
</Formik>

      )}
    </Dialog>
  );
};

export default ReportActionDialog;
