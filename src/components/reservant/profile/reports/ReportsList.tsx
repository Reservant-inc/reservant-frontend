import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { fetchGET } from '../../../../services/APIconn'
import { PaginationType, ReportType } from '../../../../services/types'
import { ReportsListType } from '../../../../services/enums'

import Report from './Report'
import Search from '../../../reusableComponents/Search'
import { useTranslation } from 'react-i18next'
import { Button, CircularProgress } from '@mui/material'
interface ReportsListProps {
  listType: ReportsListType
}

const ReportsList: React.FC<ReportsListProps> = ({ listType }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [reports, setReports] = useState<
    (ReportType & { userRole?: string })[]
  >([])
  const [isAscending, setIsAscending] = useState<boolean>(false)
  const [filteredReports, setFilteredReports] = useState<
    (ReportType & { userRole?: string })[]
  >([])
  const [t] = useTranslation('global')

  const location = useLocation()

  const { userId } = useParams<{ userId: string }>()

  const noReportsMessage: Record<ReportsListType, string> = {
    [ReportsListType.Created]: t('profile.reports.no-reports-created'),
    [ReportsListType.CustomerService]: t(
      'profile.reports.no-reports-customer-service'
    )
  }

  useEffect(() => {
    fetchReports()
  }, [location])

  const fetchReports = async () => {
    try {
      setLoading(true)

      var data: (ReportType & { userRole?: string })[]

      if (listType === ReportsListType.Created) {
        const response: PaginationType = await fetchGET('/user/reports')
        data = response.items as ReportType[]
      } else {
        const createdReportsResponse: PaginationType = await fetchGET(
          `/reports?createdById=${userId}`
        )
        const relatedReportsResponse: PaginationType = await fetchGET(
          `/reports?reportedUserId=${userId}`
        )

        const createdReports = (
          createdReportsResponse.items as ReportType[]
        ).map(report => ({
          ...report,
          userRole: 'creator'
        }))

        const relatedReports = (
          relatedReportsResponse.items as ReportType[]
        ).map(report => ({
          ...report,
          userRole: 'reported'
        }))

        const mergedReports: (ReportType & { userRole: string })[] = [
          ...createdReports,
          ...relatedReports
        ]

        mergedReports.sort(
          (a, b) =>
            new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
        )

        data = mergedReports
      }

      setReports(data)
      setFilteredReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (query: string) => {
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
      <div className="flex flex-col gap-2 h-full">
        <div className="w-1/3 ">
          <Search
            filter={handleSearchChange}
            placeholder={t('profile.reports.search')}
          />
        </div>

        <div className="flex flex-col h-full pr-2 overflow-y-auto scroll gap-2 jusitfy-center items-center">
          {!loading ? (
            filteredReports.length === 0 ? (
              <p className="italic text-center">{noReportsMessage[listType]}</p>
            ) : (
              filteredReports.map(report => (
                <Report report={report} listType={listType} />
              ))
            )
          ) : (
            <CircularProgress className="text-grey-2" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportsList
