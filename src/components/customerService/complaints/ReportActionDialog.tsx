import React, { useState, useEffect } from 'react'
import Dialog from '../../reusableComponents/Dialog'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { fetchPOST, fetchPUT, fetchGET } from '../../../services/APIconn'
import { useTranslation } from 'react-i18next'

interface ReportActionDialogProps {
  open: boolean
  onClose: () => void
  actionType?: 'assign' | 'resolve'
  reportId: number
  setAlertMessage: Function
  refreshReports: () => void
}

const ReportActionDialog: React.FC<ReportActionDialogProps> = ({
  open,
  onClose,
  setAlertMessage,
  actionType,
  reportId,
  refreshReports
}) => {
  const [agents, setAgents] = useState<any[]>([]) // Placeholder
  const [t] = useTranslation('global')

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetchGET(
          '/users/fced96c1-dad9-49ff-a598-05e1c5e433aa'
        )
        setAgents([response])
      } catch (error) {
        console.error('Error fetching agents:', error)
      }
    }

    if (open && actionType === 'assign') {
      fetchAgents()
    }
  }, [open, actionType])

  const assignValidationSchema = Yup.object({
    agentId: Yup.string().required(
      t('customer-service.report-details.agent-required')
    )
  })

  const resolveValidationSchema = Yup.object({
    comment: Yup.string()
      .required(t('customer-service.report-details.comment-required'))
      .min(3, t('customer-service.report-details.comment-min'))
  })

  const handleAssignSubmit = async (values: { agentId: string }) => {
    try {
      const body = JSON.stringify({ agentId: values.agentId })
      await fetchPOST(`/reports/${reportId}/assign-to`, body)
      setAlertMessage(t('customer-service.report-details.assign-success'))
      refreshReports()
    } catch (error) {
      console.error('Error assigning agent:', error)
    }
  }

  const handleResolveSubmit = async (values: {
    comment: string
    isResolutionPositive: boolean
  }) => {
    try {
      const body = JSON.stringify({
        supportComment: values.comment,
        isResolutionPositive: values.isResolutionPositive
      })

      await fetchPUT(`/reports/${reportId}/resolution`, body)
      refreshReports()
    } catch (error) {
      console.error('Error resolving report:', error)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title={
          actionType === 'assign'
            ? t('customer-service.report-details.assign-agent')
            : t('customer-service.report-details.resolve-complaint')
        }
      >
        {actionType === 'assign' ? (
          <Formik
            initialValues={{ agentId: '' }}
            validationSchema={assignValidationSchema}
            onSubmit={handleAssignSubmit}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form className="p-4 flex flex-col gap-4 w-[400px]">
                <label
                  htmlFor="agentId"
                  className="dark:text-grey-1 font-mont-md text-sm"
                >
                  {t('customer-service.report-details.select-agent')}
                </label>
                <Field
                  as="select"
                  name="agentId"
                  id="agentId"
                  className={`w-full cursor-pointer border dark:bg-black dark:text-grey-1 ${
                    errors.agentId && touched.agentId ? 'border-red' : ''
                  } rounded-md`}
                >
                  <option value="">
                    {t('customer-service.report-details.no-agent-selected')}
                  </option>
                  {agents.map(agent => (
                    <option key={agent.userId} value={agent.userId}>
                      {agent.firstName} {agent.lastName}
                    </option>
                  ))}
                </Field>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-primary dark:border-secondary dark:text-secondary hover:bg-primary hover:text-white border-primary dark:hover:bg-secondary dark:hover:text-black border-[1px] rounded-md"
                  >
                    {t('customer-service.report-details.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || !dirty}
                    className={`px-4 py-2 text-primary dark:border-secondary dark:text-secondary  border-primary  border-[1px] rounded-md ${
                      !isValid || !dirty
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black'
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
            initialValues={{ comment: '', isResolutionPositive: true }}
            validationSchema={resolveValidationSchema}
            onSubmit={handleResolveSubmit}
          >
            {({ errors, touched, isValid, values, dirty }) => (
              <Form>
                <div className="w-[470px] h-[270px] p-4 gap-3 flex flex-col">
                  <h1 className="dark:text-grey-1 font-mont-bd text-xl">
                    {t('customer-service.report-details.resolve-comment')}
                  </h1>
                  <div className="flex-grow">
                    <Field
                      type="text"
                      name="comment"
                      label="Comment"
                      as="textarea"
                      placeholder="Min. 3 characters "
                      rows="4"
                      className={`w-full dark:bg-black  dark:text-grey-1 p-2 border ${
                        errors.comment && touched.comment ? 'border-red' : ''
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
                      className="px-4 py-2 text-primary dark:border-secondary dark:text-secondary hover:bg-primary hover:text-white border-primary dark:hover:bg-secondary dark:hover:text-black border-[1px] rounded-md"
                    >
                      {t('customer-service.report-details.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={!isValid || !dirty}
                      className={`px-4 py-2 text-primary dark:border-secondary dark:text-secondary  border-primary  border-[1px] rounded-md ${
                        !isValid || !dirty
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black'
                      }`}
                    >
                      {t('customer-service.report-details.resolve-positive')}
                    </button>
                    <button
                      type="submit"
                      onClick={() => (values.isResolutionPositive = false)}
                      disabled={!isValid || !dirty}
                      className={`px-4 py-2 text-primary dark:border-secondary dark:text-secondary  border-primary  border-[1px] rounded-md ${
                        !isValid || !dirty
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black'
                      }`}
                    >
                      {t('customer-service.report-details.resolve-negative')}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Dialog>
    </>
  )
}

export default ReportActionDialog
