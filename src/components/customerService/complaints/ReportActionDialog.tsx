import React, { useState, useEffect } from 'react'
import Dialog from '../../reusableComponents/Dialog'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { fetchPOST, fetchPUT, fetchGET } from '../../../services/APIconn'
import { useTranslation } from 'react-i18next'
import { UserType } from '../../../services/types'

interface ReportActionDialogProps {
  open: boolean
  onClose: () => void
  actionType?: 'assign' | 'resolve'
  reportId: number
  refreshReports: () => void
  setAlertMessage: Function
  assignedAgents: any[]
  isManager: boolean
  currentUser: UserType
}

const ReportActionDialog: React.FC<ReportActionDialogProps> = ({
  open,
  onClose,
  setAlertMessage,
  actionType,
  reportId,
  refreshReports,
  assignedAgents,
  isManager,
  currentUser
}) => {
  const [agents, setAgents] = useState<any[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { t } = useTranslation('global')

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetchGET('/users/customer-support')
        setAgents(response.items || [])
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

  const isAgentAssigned = (agentId: string): boolean => {
    return assignedAgents.some(assigned => assigned.agent.userId === agentId)
  }

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
                setSuccessMessage(null)
                onClose()
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
          {({ values, errors, touched, isValid, dirty }) => (
            <Form className="p-4 flex flex-col gap-4 w-[400px] dark:text-white">
              <label htmlFor="agentId" className="font-mont-md text-sm">
                {t('customer-service.report-details.select-agent')}
              </label>
              <Field
                as="select"
                name="agentId"
                id="agentId"
                className={`w-full cursor-pointer border ${
                  errors.agentId && touched.agentId
                    ? 'border-red'
                    : 'border-primary dark:border-secondary'
                } rounded-md`}
              >
                {!values.agentId && (
                  <option value="" disabled hidden className="italic">
                    {t('customer-service.report-details.no-agent-selected')}
                  </option>
                )}
                {agents.map(agent => {
                  const assigned = isAgentAssigned(agent.userId)
                  return (
                    <option
                      key={agent.userId}
                      value={agent.userId}
                      disabled={assigned}
                      className={assigned ? 'text-grey-4' : 'text-black'}
                    >
                      {agent.firstName} {agent.lastName}{' '}
                      {assigned &&
                        `(${t('customer-service.report-details.already-assigned')})`}
                    </option>
                  )
                })}
                {isManager && (
                  <option
                    key={currentUser.userId}
                    value={currentUser.userId}
                    disabled={isAgentAssigned(currentUser.userId)}
                    className={
                      isAgentAssigned(currentUser.userId)
                        ? 'text-grey-4'
                        : 'text-black'
                    }
                  >
                    {currentUser.firstName} {currentUser.lastName}{' '}
                    {isAgentAssigned(currentUser.userId) &&
                      `(${t('customer-service.report-details.already-assigned')})`}
                  </option>
                )}
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
  )
}

export default ReportActionDialog
