import React, { useContext } from 'react'
import { ReportType } from '../../../../services/types'
import { Message } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ReportsListType } from '../../../../services/enums'
import { fetchPOST } from '../../../../services/APIconn'
import { FetchError } from '../../../../services/Errors'
import { ThreadContext } from '../../../../contexts/ThreadContext'

interface ReportProps {
  report: ReportType & { userRole?: string }
  listType: ReportsListType
}

const Report: React.FC<ReportProps> = ({ report, listType }) => {
  const [t] = useTranslation('global')

  const { handleThreadOpen } = useContext(ThreadContext)

  /*

  issues:

  1. w zwracanych zgłoszeniach nie ma powiązanego threada
  2. w threadach nie ma rozróżnienia na bok/znajomy
  3. zgłoszenia nadal nie zwracają statusu
  4. zaseedowane zgłoszenia nie mają powiązanej osoby przypisanej do zgłoszenia. czy resolvedBy to osoba obsługująca zgłoszenie czy zamykająca zgłoszenie?

  rozwiązania:
  
  1. trzeba poprawić get /user/reports tak aby zwracało powiązany thread
  2. trzeba dodać takie rozróżnienie - narazie z issue się wstrzymuję
  3. issue na backend jest już od dawna
  4. trzeba zagadać do Olka

  */

  const openChat = async () => {
    try {
      const body = JSON.stringify({
        title: report.reportId,
        participantIds: [report.resolvedBy.userId]
      })
      const response = await fetchPOST(`/threads`, body)
      handleThreadOpen(response)
    } catch (error) {
      if (error instanceof FetchError) console.log(error.formatErrors())
      else console.log('Unexpected error')
    }
  }

  return (
    <div className="p-2 pl-0 w-full">
      <div className="flex w-full h-fit gap-2 bg-grey-0 dark:bg-grey-6 p-4 rounded-lg justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <h1 className="text-lg font-mont-bd">{report.category}</h1>
            {listType === ReportsListType.CustomerService &&
              (report.userRole === 'creator' ? (
                <h1 className="text-sm text-green">
                  {t('profile.reports.created-by-user')}
                </h1>
              ) : (
                <h1 className="text-sm text-error">
                  {t('profile.reports.reported-user')}
                </h1>
              ))}
          </div>
          <div className="flex flex-col gap-1">
            {report.reportDate && (
              <p className="text-xs">
                {format(new Date(report.reportDate), 'dd-MM-yyyy, HH:mm')}
              </p>
            )}
            <p className="text-xs">
              {t('profile.reports.id')}: {report.reportId}
            </p>
          </div>
          <p className="text-sm text-wrap overflow-hidden">
            {report.description}
          </p>
        </div>
        <button onClick={openChat}>
          <Message />
        </button>
      </div>
    </div>
  )
}

export default Report
