import React from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ReportsTabs from './ReportsTabs'

const ReportsTab: React.FC = () => {
  const [t] = useTranslation('global')

  return (
    <div className="flex flex-col rounded-lg w-full h-full">
      <div className="flex justify-between items-center">
        <div className="px-2 ">
          <h1 className="text-lg font-mont-bd dark:text-grey-1">Reports</h1>
        </div>
        <ReportsTabs />
      </div>
      <div className="w-full h-[calc(100%-3rem)] bg-white rounded-lg rounded-tr-none shadow-md dark:bg-black dark:text-grey-1 p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default ReportsTab
