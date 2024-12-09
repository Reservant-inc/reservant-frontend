import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { fetchGET } from '../../../../services/APIconn'
import {
  EventDataType,
  PaginationType,
  ReportType
} from '../../../../services/types'
import { EventListType, ReportsListType } from '../../../../services/enums'

import Report from './Report'
interface ReportsListProps {
  listType: ReportsListType
}

const ReportsList: React.FC<ReportsListProps> = ({ listType }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [reports, setReports] = useState<ReportType[]>([])
  const [filteredReports, setFilteredReports] = useState<ReportType[]>([])

  const location = useLocation()

  const apiRoutes: Record<ReportsListType, string> = {
    [EventListType.Created]: '/user/reports'
  }

  const noEventsMessage: Record<ReportsListType, string> = {
    [EventListType.Created]: 'Brak utworzonych zgłoszeń.'
  }

  const apiRoute = apiRoutes[listType]

  useEffect(() => {
    fetchEvents()
  }, [location])

  const fetchEvents = async () => {
    try {
      const response: ReportType[] = await fetchGET(apiRoute)

      const data: ReportType[] = response as ReportType[]

      setReports(data)
      setFilteredReports(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()

    setFilteredReports(
      query.length >= 3
        ? reports.filter(report =>
            report.description.toLowerCase().includes(query)
          )
        : reports
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex w-full items-center rounded-full border-[1px] border-grey-1 px-1 font-mont-md dark:border-grey-6">
          <input
            type="text"
            placeholder="Search reports"
            className="w-full placeholder:text-grey-2"
            onChange={handleSearchChange}
          />
          <SearchIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
        </div>

        <div className="flex flex-col h-full pr-2 overflow-y-auto scroll divide-y-[1px] divide-grey-1">
          {filteredReports.length === 0 ? (
            <p className="italic text-center">{noEventsMessage[listType]}</p>
          ) : (
            filteredReports.map(report => <Report report={report} />)
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportsList
