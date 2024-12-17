import React from 'react'
import { IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ComplaintDetailsProps {
  report: any
  onClose: () => void
}

const PendingRestaurantDetails: React.FC<ComplaintDetailsProps> = ({
  report,
  onClose
}) => {
  if (!report) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>No details found for this complaint.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-black rounded-lg relative">
      <IconButton className="absolute top-2 right-2" onClick={onClose}>
        <CloseIcon className="dark:text-white" />
      </IconButton>
      <h2 className="text-lg font-semibold mb-4">Complaint Details</h2>
      <div className="space-y-4">
        <p>
          <strong>ID:</strong> {report.reportId}
        </p>
        <p>
          <strong>Date:</strong> {new Date(report.reportDate).toLocaleString()}
        </p>
        <p>
          <strong>Category:</strong> {report.category}
        </p>
        <p>
          <strong>Description:</strong>{' '}
          {report.description || 'No description provided'}
        </p>
        <p>
          <strong>Submitted By:</strong>{' '}
          {report.createdBy
            ? `${report.createdBy.firstName} ${report.createdBy.lastName}`
            : 'Unknown'}
        </p>
        <p>
          <strong>Reported User:</strong>{' '}
          {report.reportedUser
            ? `${report.reportedUser.firstName} ${report.reportedUser.lastName}`
            : 'Unknown'}
        </p>
      </div>
      <div className="mt-4 space-y-2">
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See reporter profile
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          See reported user profile
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          Forward complaint
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          Respond to complaint
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          View restaurant
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          Grant promo code
        </button>
        <button className="w-full dark:bg-black border-[1px] rounded-md p-1 bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black">
          View related order
        </button>
      </div>
    </div>
  )
}

export default PendingRestaurantDetails
