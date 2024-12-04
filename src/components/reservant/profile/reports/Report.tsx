import React, { useEffect, useState } from 'react'
import { ReportType } from '../../../../services/types'
interface ReportProps {
  report: ReportType
}

const Report: React.FC<ReportProps> = ({ report }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <h1>
        {report.reportId} {report.category} {report.reportDate}
      </h1>
      <p>{report.description}</p>
    </div>
  )
}

export default Report
