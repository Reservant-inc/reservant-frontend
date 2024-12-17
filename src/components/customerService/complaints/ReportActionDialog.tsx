import React from 'react';
import { TextField } from '@mui/material';
import Dialog from '../../reusableComponents/Dialog';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { fetchPOST, fetchPUT } from '../../../services/APIconn';

interface ReportActionDialogProps {
  open: boolean;
  onClose: () => void;
  actionType?: 'escalate' | 'resolve';
  reportId: number;
  refreshReports: () => void;
}

const ReportActionDialog: React.FC<ReportActionDialogProps> = ({ open, onClose, actionType, reportId, refreshReports }) => {
  const validationSchema = Yup.object({
    comment: Yup.string()
      .required('Comment is required')
      .min(5, 'Comment must be at least 5 characters'),
  });

  const initialValues = { comment: '' };

  const handleSubmit = async (values: { comment: string }) => {
    try {
      const body = JSON.stringify(
        actionType === 'escalate'
          ? { escalationComment: values.comment }
          : { supportComment: values.comment }
      );

      if (actionType === 'escalate') {
        await fetchPOST(`/reports/${reportId}/escalate`, body);
      } else if (actionType === 'resolve') {
        await fetchPUT(`/reports/${reportId}/resolution`, body);
      }

      refreshReports(); // Odświeżanie listy reportów
      onClose();
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={actionType === 'escalate' ? 'Escalate Complaint' : 'Resolve Complaint'}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isValid, dirty }) => (
          <Form>
            <div className="p-4 space-y-4">
              <p className='font-bold text-2xl'>
                {actionType === 'escalate'
                  ? 'Report escalation comment'
                  : 'Report resolution comment'}
              </p>
              <Field
                as={TextField}
                name="comment"
                label="Comment"
                variant="outlined"
                fullWidth
                helperText={touched.comment && errors.comment ? errors.comment : ''}
                error={touched.comment && Boolean(errors.comment)}
              />
              <div className="flex justify-end gap-2">
                <button onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" color="primary" disabled={!isValid || !dirty}>
                  {actionType === 'escalate' ? 'Escalate' : 'Resolve'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ReportActionDialog;
