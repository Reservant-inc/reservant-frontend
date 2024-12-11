import React, { useEffect, useState } from 'react'
import { ReportType } from '../../../../services/types'
import { Message } from '@mui/icons-material'
import { format, parse } from 'date-fns'
interface ReportProps {
  report: ReportType
}

const Report: React.FC<ReportProps> = ({ report }) => {
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="flex flex-col w-full h-fit p-3 gap-2 bg-grey-5 rounded-lg">
      <div className="justify-between flex">
        <div className="flex flex-col gap-[1px]">
          <h1 className="text-lg">{report.category}</h1>
          {report.reportDate && (
            <p className="text-xs">{formatTimestamp(report.reportDate)}</p>
          )}
          <p className="text-xs">Report ID: {report.reportId}</p>
        </div>
        <button>
          <Message />
        </button>
      </div>
      <hr />
      <p className="text-sm text-wrap overflow-hidden">{report.description}</p>
    </div>
  )
}

export default Report
