import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import ReportActionDialog from './ReportActionDialog'
import { ReportType, UserType, VisitType } from '../../../services/types'
import { getImage } from '../../../services/APIconn'
import DefaultImage from '../../../assets/images/user.jpg'
import CloseIcon from '@mui/icons-material/Close'

import { useTranslation } from 'react-i18next'

interface ComplaintDetailsProps {
  report: ReportType
  onClose: () => void
  refreshReports: () => void
  setAlertMessage: Function
  isManager: boolean
  currentUser: UserType
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  report,
  onClose,
  setAlertMessage,
  refreshReports,
  isManager,
  currentUser
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'assign' | 'resolve'>()

  const [t] = useTranslation('global')

  const openDialog = (type: 'assign' | 'resolve') => {
    setActionType(type)
    setDialogOpen(true)
  }

  const renderVisitDetails = (visit: VisitType) => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 px-4 pt-2">
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.report-details.visit-id')}:{' '}
          </p>
          <p>{visit.visitId}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.report-details.date')}:{' '}
          </p>
          <p>{new Date(visit.date).toLocaleDateString()}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.report-details.start-time')}:{' '}
          </p>
          <p>{visit.actualStartTime}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.report-details.end-time')}:{' '}
          </p>
          <p>{visit.actualEndTime}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.report-details.number-of-people')}:{' '}
          </p>
          <p>{visit.numberOfGuests}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.report-details.deposit')}:{' '}
          </p>
          <p>{visit.deposit ? `${visit.deposit} USD` : `${t('complaints.none')}`}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.report-details.takeaway')}:{' '}
          </p>
          <p>{visit.takeaway ? `${t('complaints.yes')}` : `${t('complaints.no')}`}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.report-details.related-restaurant')}:{' '}
          </p>
          <p>{visit.restaurant.name}</p>
        </h1>
        <Link
          to={`/customer-service/restaurants/${report.visit?.restaurant.restaurantId}`}
        >
          <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
            {t('customer-service.report-details.go-to-restaurant')}
          </h1>
        </Link>
      </div>
    </div>
  )

  const renderAssignedAgents = () => (
    <div>
      <h1 className="font-mont-bd text-md">
        {t('customer-service.report-details.assigned-agents')}
      </h1>
      {report.assignedAgents.length > 0 ? (
        report.assignedAgents.map(agent => (
          <div
            key={agent.agent.userId}
            className="flex items-center gap-2 px-4 pt-2"
          >
            <img
              src={getImage(agent.agent.photo, DefaultImage)}
              alt={`${agent.agent.firstName} ${agent.agent.lastName}`}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-mont-bd text-sm">
                {agent.agent.firstName} {agent.agent.lastName}
              </p>
              <p className="text-sm text-grey-3">{agent.agent.userId}</p>
              <p className="text-sm">
                {t('customer-service.report-details.assigned-from')}:{' '}
                {new Date(agent.from).toLocaleString()}
                {agent.until && (
                  <>
                    {' '}
                    {t('customer-service.report-details.assigned-until')}:{' '}
                    {new Date(agent.until).toLocaleString()}
                  </>
                )}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-grey-3">
          {t('customer-service.report-details.no-assigned-agents')}
        </p>
      )}
    </div>
  )

  const renderUserDetails = (
    label: string,
    user: UserType,
    comment?: string,
    date?: string,
    showProfileButton?: boolean
  ) => (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-mont-bd text-md">{label}</h1>
        {showProfileButton && (
          <Link to={`/customer-service/users/${user.userId}`}>
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              {t('customer-service.report-details.go-to-profile')}
            </h1>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-2 px-4 pt-2">
        <img
          src={getImage(user.photo, DefaultImage)}
          alt="user image"
          className="w-8 h-8 rounded-full self-start"
        />
        <div>
          <p className="font-mont-bd text-sm">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-grey-3">{user.userId}</p>
          {comment && (
            <h1 className="flex gap-2 text-sm">
              <p className="font-mont-bd">
                {t('customer-service.report-details.comment')}:{' '}
              </p>
              <p>{comment}</p>
            </h1>
          )}
          {date && (
            <p className="text-sm">
              <strong>{t('customer-service.report-details.date')}:</strong>{' '}
              {new Date(date).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-black rounded-lg flex flex-col gap-3 relative overflow-y-auto scroll">
      <IconButton className="absolute top-2 right-2" onClick={onClose}>
        <CloseIcon className="dark:text-white" />
      </IconButton>
      <div className="flex flex-col">
        <h1 className="text-lg font-mont-bd">
          {t('customer-service.report-details.report-details')}
        </h1>
        <h1 className="text-sm text-grey-4 dark:text-grey-2">
          {t('customer-service.report-details.complaint-id')}: {report.reportId}
        </h1>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.report-details.date')}:{' '}
          </p>
          <p>{new Date(report.reportDate).toLocaleString()}</p>
        </div>
        <div className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.reports.category')}:{' '}
          </p>
          <p>{report.category}</p>
        </div>
        <div className="flex gap-3 text-sm">
          <p className="font-mont-bd">
            {t('customer-service.reports.description')}:{' '}
          </p>
          <p className="break-words w-[270px]">
            {report.description || 'No description provided'}
          </p>
        </div>
      </div>

      {/* Related Visit */}
      <div>
        <div className="flex justify-between">
          <p className="font-mont-bd text-md">
            {t('customer-service.report-details.related-visit')}:{' '}
          </p>
          <Link to={`/customer-service/visits/${report.visit?.visitId}`}>
            <h1 className="underline text-sm text-grey-4 dark:text-grey-2">
              {t('customer-service.report-details.go-to-visit')}
            </h1>
          </Link>
        </div>
        {report.visit ? (
          renderVisitDetails(report.visit)
        ) : (
          <p className="text-sm ml-4">
            {t('customer-service.report-details.no-related-visit')}
          </p>
        )}
      </div>

      {/* User Details */}
      {report.createdBy &&
        renderUserDetails(
          t('customer-service.reports.submitted-by'),
          report.createdBy,
          undefined,
          undefined,
          true
        )}
      {report.reportedUser &&
        renderUserDetails(
          t('customer-service.report-details.reported-user'),
          report.reportedUser,
          undefined,
          undefined,
          true
        )}

      {/* Assigned BOKs */}
      {renderAssignedAgents()}

      {report.resolvedBy &&
        renderUserDetails(
          t('customer-service.report-details.resolved-by'),
          report.resolvedBy,
          report.resolutionComment,
          report.resolutionDate,
          true
        )}

      <div className=" flex gap-4">
        {!report.resolvedBy && (
          <>
            <button
              onClick={() => openDialog('assign')}
              className="px-4 py-2 text-primary dark:border-secondary dark:text-secondary hover:bg-primary hover:text-white border-primary dark:hover:bg-secondary dark:hover:text-black border-[1px] rounded-md"
            >
              {t('customer-service.report-details.assign-agent')}
            </button>
            <button
              onClick={() => openDialog('resolve')}
              className={`px-4 py-2 text-primary dark:border-secondary dark:text-secondary hover:bg-primary hover:text-white border-primary dark:hover:bg-secondary dark:hover:text-black border-[1px] rounded-md`}
            >
              {t('customer-service.report-details.resolve-complaint')}
            </button>
          </>
        )}

        <ReportActionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          actionType={actionType}
          setAlertMessage={setAlertMessage}
          reportId={report.reportId}
          refreshReports={refreshReports}
          assignedAgents={report.assignedAgents}
          isManager={isManager}
          currentUser={currentUser}
        />
      </div>
    </div>
  )
}

export default ComplaintDetails
