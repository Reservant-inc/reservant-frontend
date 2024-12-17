import React from 'react'
import { TextField } from '@mui/material'
import Dialog from '../../reusableComponents/Dialog'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { fetchPOST, fetchPUT } from '../../../services/APIconn'

interface ReportActionDialogProps {
  open: boolean
  onClose: () => void
  actionType?: 'escalate' | 'resolve'
  reportId: number
  refreshReports: () => void
}

const ReportActionDialog: React.FC<ReportActionDialogProps> = ({
  open,
  onClose,
  actionType,
  reportId,
  refreshReports
}) => {
  const validationSchema = Yup.object({
    comment: Yup.string()
      .required('Comment is required')
      .min(5, 'Comment must be at least 5 characters')
  })

  const initialValues = { comment: '' }

  const handleSubmit = async (values: { comment: string }) => {
    try {
      const body = JSON.stringify(
        actionType === 'escalate'
          ? { escalationComment: values.comment }
          : { supportComment: values.comment }
      )

      if (actionType === 'escalate') {
        await fetchPOST(`/reports/${reportId}/escalate`, body)
      } else if (actionType === 'resolve') {
        await fetchPUT(`/reports/${reportId}/resolution`, body)
      }

      refreshReports()
      onClose()
    } catch (error) {
      console.error('Error performing action:', error)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={actionType === 'escalate' ? 'Escalate Complaint' : 'Resolve Complaint'}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isValid, dirty }) => (
          <Form>
            <div className="w-[400px] h-[270px] p-6 flex flex-col justify-between">
              <p className="font-bold text-xl">
                {actionType === 'escalate'
                  ? 'Report escalation comment'
                  : 'Report resolution comment'}
              </p>
              <div className="flex-grow">
                <Field
                  type="text"
                  name="comment"
                  label="Comment"
                  as={TextField}
                  variant="standard"
                  fullWidth
                  helperText={
                    touched.comment && errors.comment
                      ? errors.comment
                      : ''
                  }
                  error={touched.comment && Boolean(errors.comment)}
                  className={`[&>*]:label-[20px] [&>*]:font-mont-md [&>*]:text-[15px] ${
                    !(errors.comment && touched.comment)
                      ? '[&>*]:text-black [&>*]:before:border-black [&>*]:after:border-secondary'
                      : '[&>*]:text-error [&>*]:before:border-error [&>*]:after:border-error'
                  }`}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition"
                >
                  Cancel
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
                  {actionType === 'escalate' ? 'Escalate' : 'Resolve'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

export default ReportActionDialog

// border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition