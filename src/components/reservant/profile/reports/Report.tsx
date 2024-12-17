import React from 'react'
import { ReportType } from '../../../../services/types'
import { Message } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

interface ReportProps {
  report: ReportType
}

const Report: React.FC<ReportProps> = ({ report }) => {
  const [t] = useTranslation('global')

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleString(i18next.language === 'en' ? 'en-GB' : 'pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="p-3 pl-0">
      <div className="flex flex-col w-full h-fit border-l-[1px] pl-3 dark:border-grey-0 border-grey-2 gap-2 ">
        <div className="justify-between flex">
          <div className="flex flex-col gap-[1px]">
            <h1 className="text-lg">{report.category}</h1>
            {report.reportDate && (
              <p className="text-xs">{formatTimestamp(report.reportDate)}</p>
            )}
            <p className="text-xs">
              {t('profile.reports.id')}: {report.reportId}
            </p>
          </div>
          <button>
            <Message />
          </button>
        </div>
        <hr className="dark:text-grey-0 text-grey-2" />
        <p className="text-sm text-wrap overflow-hidden">
          {report.description}
        </p>
      </div>
    </div>
  )
}

export default Report
