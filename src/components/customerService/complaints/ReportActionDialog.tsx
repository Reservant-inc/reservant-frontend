import React, { useState, useEffect } from 'react';
import Dialog from '../../reusableComponents/Dialog';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { fetchPOST, fetchPUT, fetchGET } from '../../../services/APIconn';
import { useTranslation } from 'react-i18next';

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
  const [agents, setAgents] = useState<any[]>([]); // Placeholder 
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
      .min(5, t('customer-service.report-details.comment-min')),
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

  const handleResolveSubmit = async (values: { comment: string }) => {
    try {
      const body = JSON.stringify({ supportComment: values.comment });
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
        <div className="p-4">
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
            <Form className="p-4 flex flex-col gap-4">
              <label htmlFor="agentId" className="font-mont-md text-sm">
                {t('customer-service.report-details.select-agent')}
              </label>
              <Field
                as="select"
                name="agentId"
                id="agentId"
                className={`w-full p-2 border ${
                  errors.agentId && touched.agentId ? 'border-red' : 'border-primary'
                } rounded-md`}
              >
                <option value="">
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
                  className="px-4 py-2 text-primary border-primary bg-white hover:bg-primary hover:text-white border-[1px] rounded-md"
                >
                  {t('customer-service.report-details.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!isValid || !dirty}
                  className={`px-4 py-2 text-primary border-primary bg-white hover:bg-primary hover:text-white border-[1px] rounded-md ${
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
        <Formik
          initialValues={{ comment: '' }}
          validationSchema={resolveValidationSchema}
          onSubmit={handleResolveSubmit}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <div className="w-[400px] p-4 gap-3 flex flex-col">
                <p className="font-mont-bd text-xl">
                  {t('customer-service.report-details.resolve-comment')}
                </p>
                <div className="flex-grow">
                  <Field
                    type="text"
                    name="comment"
                    label="Comment"
                    as="textarea"
                    rows="4"
                    className={`w-full p-2 border ${
                      errors.comment && touched.comment
                        ? 'border-red'
                        : 'border-primary'
                    } rounded-md`}
                  />
                  {errors.comment && touched.comment && (
                    <p className="text-red text-sm">{errors.comment}</p>
                  )}
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1 border-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary"
                  >
                    {t('customer-service.report-details.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || !dirty}
                    className={`border-[1px] rounded-md p-1 ${
                      isValid && dirty
                        ? 'border-primary text-primary hover:bg-primary hover:text-white hover:scale-105 transition'
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
