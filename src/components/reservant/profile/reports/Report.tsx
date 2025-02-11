import React, { useContext, useState } from 'react'
import { ReportType, ThreadType } from '../../../../services/types'
import { Circle, Message } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ReportsListType } from '../../../../services/enums'
import { fetchGET } from '../../../../services/APIconn'
import { FetchError } from '../../../../services/Errors'
import { ThreadContext } from '../../../../contexts/ThreadContext'
import Cookies from 'js-cookie'
import Dialog from '../../../reusableComponents/Dialog'

interface ReportProps {
  report: ReportType & { userRole?: string }
  listType: ReportsListType
}

const Report: React.FC<ReportProps> = ({ report, listType }) => {
  const [t] = useTranslation('global')

  const { handleThreadOpen } = useContext(ThreadContext)
  const [openNote, setOpenNote] = useState<boolean>(false)

  const openChat = async () => {
    try {
      const response: ThreadType = await fetchGET(`/threads/${report.threadId}`)
      handleThreadOpen(response)
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
      else console.error('Unexpected error')
    }
  }

  const isAssigned =
    (Cookies.get('userInfo') as string) &&
    report.assignedAgents.some(
      assignedAgent =>
        assignedAgent.agent.userId ===
        JSON.parse(Cookies.get('userInfo') as string)?.userId
    )

  return (
    <div className="p-2 pl-0 w-full">
      <div className="flex w-full h-fit gap-2 bg-grey-0 dark:bg-grey-6 p-4 rounded-lg justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <h1 className="text-lg font-mont-bd">
              {report.category === 'LostItem'
                ? t('profile.reports.category.lost')
                : report.category === 'RestaurantEmployeeReport'
                  ? t('profile.reports.category.emp')
                  : report.category === 'Technical'
                    ? t('profile.reports.category.technical')
                    : report.category}
            </h1>
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

          {report.reportStatus && (
            <p className="text-xs flex items-center gap-1">
              <Circle
                className={`${report.reportStatus === 'ResolvedNegatively' ? 'text-red' : report.reportStatus === 'NotResolved' ? 'text-warning' : 'text-green'} text-xs`}
              />
              {report.reportStatus === 'ResolvedNegatively' ? (
                <p className="flex gap-1">
                  <p>{t('profile.reports.status.rejected')}, </p>
                  <p
                    className="underline hover:cursor-pointer"
                    onClick={() => setOpenNote(true)}
                  >
                    {t('profile.reports.see-note')}{' '}
                  </p>
                </p>
              ) : report.reportStatus === 'NotResolved' ? (
                t('profile.reports.status.pending')
              ) : (
                <p className="flex gap-1">
                  <p>{t('profile.reports.status.resolved')},</p>
                  <p
                    className="underline hover:cursor-pointer"
                    onClick={() => setOpenNote(true)}
                  >
                    {t('profile.reports.see-note')}
                  </p>
                </p>
              )}
            </p>
          )}
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

        {(listType === ReportsListType.Created ||
          (listType === ReportsListType.CustomerService && isAssigned)) && (
          <button onClick={openChat}>
            <Message />
          </button>
        )}
      </div>
      {openNote && (
        <Dialog
          open={openNote}
          onClose={() => {
            setOpenNote(false)
          }}
          title={t('profile.reports.note')}
        >
          <div className="w-[300px] h-[200px] p-2 dark:text-grey-0 overflow-y-auto scroll">
            <p>{report.resolutionComment}</p>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default Report
