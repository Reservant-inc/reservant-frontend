import React, { useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import ReportActionDialog from './ReportActionDialog';

interface ComplaintDetailsProps {
  report: any;
  onClose: () => void;
  refreshReports: () => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ report, onClose, refreshReports }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'escalate' | 'resolve'>();
  const navigate = useNavigate();

  const openDialog = (type: 'escalate' | 'resolve') => {
    setActionType(type);
    setDialogOpen(true);
  };

  const navigateToUserProfile = (userId: string) => {
    navigate(`/customer-service/users/${userId}`);
  };

  const navigateToVisitDetails = (visitId: string) => {
    navigate(`/customer-service/visits/${visitId}`);
  };

  const navigateToRestaurantDetails = (restaurantId: string) => {
    navigate(`/customer-service/restaurants/${restaurantId}`);
  };

  const renderVisitDetails = (visit: any) => (
    <div className="space-y-1 ml-4 text-sm">
      <p><strong>Visit ID:</strong> {visit.visitId}</p>
      <p><strong>Date:</strong> {new Date(visit.date).toLocaleDateString()}</p>
      <p><strong>End Time:</strong> {visit.endTime}</p>
      <p><strong>Actual Start Time:</strong> {visit.actualStartTime || 'N/A'}</p>
      <p><strong>Actual End Time:</strong> {visit.actualEndTime || 'N/A'}</p>
      <p><strong>Number of People:</strong> {visit.numberOfPeople}</p>
      <p><strong>Deposit:</strong> {visit.deposit ? `${visit.deposit} USD` : 'None'}</p>
      <p><strong>Takeaway:</strong> {visit.takeaway ? 'Yes' : 'No'}</p>
      <p><strong>Client ID:</strong> {visit.clientId}</p>
      {visit.restaurant ? (
        <>
          <p><strong>Related Restaurant ID:</strong> {visit.restaurant.restaurantId}</p>
          <button
            onClick={() => navigateToRestaurantDetails(visit.restaurant.restaurantId)}
            className="border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition"
          >
            See related Restaurant
          </button>
        </>
      ) : (
        <p><strong>Related Restaurant:</strong> None</p>
      )}
      <button
        onClick={() => navigateToVisitDetails(visit.visitId)}
        className="border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition mt-2"
      >
        See related Visit
      </button>
    </div>
  );

  const renderUserDetails = (label: string, user: any, comment?: string, date?: string, showProfileButton?: boolean) => (
    <div className="space-y-1">
      <p className="font-semibold">{label}</p>
      <div className="flex items-center gap-2 ml-4">
        <Avatar alt={user.firstName} src={user.photo || undefined} />
        <div>
          <p className="font-bold">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500">{user.userId}</p>
        </div>
      </div>
      {showProfileButton && (
        <button
          className="ml-4 text-sm border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition"
          onClick={() => navigateToUserProfile(user.userId)}
        >
          {label === 'Submitted By' ? "See reporting User's profile" : "See Reported User's profile"}
        </button>
      )}
      {comment && <p className="text-sm ml-4"><strong>Comment:</strong> {comment}</p>}
      {date && <p className="text-sm ml-4"><strong>Date:</strong> {new Date(date).toLocaleString()}</p>}
    </div>
  );

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-black rounded-lg relative">
      <IconButton className="absolute top-2 right-2" onClick={onClose}>
        <CloseIcon className="dark:text-white" />
      </IconButton>
      <h2 className="text-lg font-semibold mb-4">Complaint Details</h2>
      <div className="space-y-4">
        <p><strong>ID:</strong> {report.reportId}</p>
        <p><strong>Date:</strong> {new Date(report.reportDate).toLocaleString()}</p>
        <p><strong>Category:</strong> {report.category}</p>
        <p><strong>Description:</strong> {report.description || 'No description provided'}</p>

        {/* Related Visit */}
        <div>
          <p className="font-semibold">Related Visit:</p>
          {report.visit ? (
            renderVisitDetails(report.visit)
          ) : (
            <p className="text-sm ml-4">No visit related to this complaint.</p>
          )}
        </div>

        {/* User Details */}
        {report.createdBy && renderUserDetails('Submitted By', report.createdBy, undefined, undefined, true)}
        {report.reportedUser && renderUserDetails('Reported User', report.reportedUser, undefined, undefined, true)}
        {report.escalatedBy && renderUserDetails('Escalated By', report.escalatedBy, report.escalationComment, report.reportDate)}
        {report.resolvedBy && renderUserDetails('Resolved By', report.resolvedBy, report.resolutionComment, report.resolutionDate)}
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => openDialog('escalate')}
          disabled={!!report.escalatedBy || !!report.resolvedBy}
          className={`w-1/2 dark:bg-black border-[1px] rounded-md p-1 bg-white text-primary transition ${
            report.escalatedBy || report.resolvedBy
              ? 'opacity-50 cursor-not-allowed'
              : 'border-primary hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black'
          }`}
        >
          {report.resolvedBy ? 'Already Resolved' : report.escalatedBy ? 'Already Escalated' : 'Escalate complaint to management'}
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
      </div>

      <ReportActionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        actionType={actionType}
        reportId={report.reportId}
        refreshReports={refreshReports}
      />
    </div>
  );
};

export default ComplaintDetails;
