import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Link, useNavigate } from 'react-router-dom'
import ReportActionDialog from './ReportActionDialog'
import { ReportType, UserType } from '../../../services/types'
import { getImage } from '../../../services/APIconn'
import DefaultImage from '../../../assets/images/user.jpg'

interface ComplaintDetailsProps {
  report: ReportType
  onClose: () => void
  refreshReports: () => void
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  report,
  onClose,
  refreshReports
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'escalate' | 'resolve'>()
  const navigate = useNavigate()

  const openDialog = (type: 'escalate' | 'resolve') => {
    setActionType(type)
    setDialogOpen(true)
  }

  const navigateToUserProfile = (userId: string) => {
    navigate(`/customer-service/users/${userId}`)
  }

  const navigateToVisitDetails = (visitId: string) => {
    navigate(`/customer-service/visits/${visitId}`)
  }

  const navigateToRestaurantDetails = (restaurantId: string) => {
    navigate(`/customer-service/restaurants/${restaurantId}`)
  }

  const renderVisitDetails = (visit: any) => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 px-4 pt-2">
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Visit ID:</p>
          <p>{visit.visitId}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Date:</p>
          <p>{new Date(visit.date).toLocaleDateString()}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Start Time:</p>
          <p>{visit.actualStartTime}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">End Time:</p>
          <p>{visit.actualEndTime}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Number of People:</p>
          <p>{visit.numberOfPeople}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Deposit:</p>
          <p>{visit.deposit ? `${visit.deposit} USD` : 'None'}</p>
        </h1>
        <h1 className="flex gap-3 text-sm">
          <p className="font-mont-bd">Takeaway:</p>
          <p>{visit.takeaway ? 'Yes' : 'No'}</p>
        </h1>
        {visit.restaurant ? (
          <>
            <h1 className="flex gap-3 text-sm">
              <p className="font-mont-bd">Related Restaurant ID:</p>
              <p>{visit.restaurant.restaurantId}</p>
            </h1>
            <button
              onClick={() =>
                navigateToRestaurantDetails(visit.restaurant.restaurantId)
              }
              className="border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition"
            >
              See related Restaurant
            </button>
          </>
        ) : (
          <h1 className="flex gap-3 text-sm">
            <p className="font-mont-bd">Related Restaurant:</p>
            <p>None</p>
          </h1>
        )}
      </div>
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
            <h1 className="underline text-sm text-grey-4">Go to profile</h1>
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
              <p className="font-mont-bd">Comment:</p>
              <p>{comment}</p>
            </h1>
          )}
          {date && (
            <p className="text-sm">
              <strong>Date:</strong> {new Date(date).toLocaleString()}
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
        <h1 className="text-lg font-mont-bd">Complaint details</h1>
        <h1 className="text-sm text-grey-2 dark:text-grey-4">
          complaint id: {report.reportId}
        </h1>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-3 text-sm">
          <p className="font-mont-bd">Date:</p>
          <p>{new Date(report.reportDate).toLocaleString()}</p>
        </div>
        <div className="flex gap-3 text-sm">
          <p className="font-mont-bd">Category:</p>
          <p>{report.category}</p>
        </div>
        <div className="flex gap-3 text-sm">
          <p className="font-mont-bd">Description:</p>
          <p className="break-words w-[270px]">
            {report.description || 'No description provided'}
          </p>
        </div>
      </div>

      {/* Related Visit */}
      <div>
        <div className="flex justify-between">
          <p className="font-mont-bd text-md">Related Visit:</p>
          <Link to={`/customer-service/visits/${report.visit.visitId}`}>
            <h1 className="underline text-sm text-grey-4">Go to visit</h1>
          </Link>
        </div>
        {report.visit ? (
          renderVisitDetails(report.visit)
        ) : (
          <p className="text-sm ml-4">No visit related to this complaint.</p>
        )}
      </div>

      {/* user details */}
      {report.createdBy &&
        renderUserDetails(
          'Submitted By',
          report.createdBy,
          undefined,
          undefined,
          true
        )}
      {report.reportedUser &&
        renderUserDetails(
          'Reported User',
          report.reportedUser,
          undefined,
          undefined,
          true
        )}
      {report.escalatedBy &&
        renderUserDetails(
          'Escalated By',
          report.escalatedBy,
          report.escalationComment,
          report.reportDate
        )}
      {report.resolvedBy &&
        renderUserDetails(
          'Resolved By',
          report.resolvedBy,
          report.resolutionComment,
          report.resolutionDate
        )}

      <div className="mt-4 flex gap-4">
        {!report.resolvedBy && (
          <>
            <button
              onClick={() => openDialog('escalate')}
              disabled={!!report.escalatedBy || !!report.resolvedBy}
              className={`w-1/2 dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition ${
                report.escalatedBy || report.resolvedBy
                  ? 'opacity-50 cursor-not-allowed'
                  : 'border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black'
              }`}
            >
              Pass complaint
            </button>
            <button
              onClick={() => openDialog('resolve')}
              disabled={!!report.resolvedBy}
              className={`w-1/2 dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition ${
                report.resolvedBy
                  ? 'opacity-50 cursor-not-allowed'
                  : 'border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black'
              }`}
            >
              {report.resolvedBy ? 'Already Resolved' : 'Resolve complaint'}
            </button>
          </>
        )}

        <ReportActionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          actionType={actionType}
          reportId={report.reportId}
          refreshReports={refreshReports}
        />
      </div>
    </div>
  )
}

export default ComplaintDetails
