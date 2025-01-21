import React, { useState, useEffect } from 'react'
import {
  OrderType,
  VisitType,
  ReportType,
  UserType
} from '../../../../services/types'
import { fetchGET, getImage, fetchPOST } from '../../../../services/APIconn'
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'
import { FetchError } from '../../../../services/Errors'
import { format } from 'date-fns'
import Dialog from '../../../reusableComponents/Dialog'
import { ReservationListType } from '../../../../services/enums'
import { Alert, IconButton, Snackbar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ErrorMes from '../../../reusableComponents/ErrorMessage'
import { report } from 'node:process'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from '../../../../contexts/SnackbarContext'

interface ReservationProps {
  reservation: VisitType
  reservationType: ReservationListType
  refreshReservations: () => void
}

const Reservation: React.FC<ReservationProps> = ({
  reservation,
  reservationType,
  refreshReservations
}) => {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [isComplaining, setIsComplaining] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [reportType, setReportType] = useState<string>('')
  const [reportNote, setReportNote] = useState<string>('')
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const { setSnackbar } = useSnackbar()

  const [t] = useTranslation('global')

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await Promise.all(
        reservation.orders.map(async order => {
          const response = await fetchGET(`/orders/${order.orderId}`)
          return response
        })
      )

      setOrders(fetchedOrders)
      setLoading(false)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error')
      }
      setLoading(false)
    }
  }

  const totalCost = reservation.orders.reduce(
    (sum, order) => sum + order.cost,
    0
  )

  useEffect(() => {
    if (reservation.orders.length > 0) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [reservation.orders])

  const validate = () => {
    if (!reportType) {
      setErrorMessage('Please select a valid report type.')
      return false
    } else if (reportType === 'complain-employee' && !selectedEmployee) {
      setErrorMessage('Please select an employee to report.')
      return false
    } else if (!reportNote) {
      setErrorMessage('Please tell us what happened.')
      return false
    }
    return true
  }

  const handleReportSubmit = async () => {
    try {
      let endpoint = ''
      let reportData: {
        description: string
        visitId: number
        reportedUserId?: string
      } = {
        description: reportNote,
        visitId: reservation.visitId
      }

      switch (reportType) {
        case 'lost-item':
          endpoint = '/reports/report-lost-item'
          break
        case 'complain-order':
          endpoint = '/reports/report-order'
          break
        case 'complain-employee':
          endpoint = '/reports/report-employee'
          reportData = {
            ...reportData,
            reportedUserId: selectedEmployee
          }
          break
        default:
          return
      }

      await fetchPOST(endpoint, JSON.stringify(reportData))
      setAlertMessage('Your report has been submitted successfully.')
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
    } finally {
      setIsComplaining(false)
      setReportType('')
      setReportNote('')
      setSelectedEmployee('')
    }
  }

  const handleCancelReservation = async () => {
    try {
      await fetchPOST(`/visits/${reservation.visitId}/cancel`)

      setIsCancelDialogOpen(false)
      await refreshReservations()
      setSnackbar('Reservation cancelled successfully', 'success'); // TODO tłumaczenie message
    } catch (error) {
      if (error instanceof FetchError) {
        const errors = error.formatErrors()
        if(errors.includes('AccessDenied')) {
          setIsCancelDialogOpen(false)
          setSnackbar('You are not the creator of this reservation.', 'error') // TODO tłuamczenie
        }
      } else {
        console.error('Failed to cancel reservation:', error);
        setIsCancelDialogOpen(false)
        setSnackbar('There was a problem canceling your reservation.', 'error'); // TODO tłumaczenie message
      }
      
      
    }
  };
  


  const allReservationEmployees = () => {
    let res: UserType[] = []
    for (let index = 0; index < orders.length; index++) {
      const emp: UserType = orders[index].assignedEmployee
      if (!res.find(e => e.userId === emp.userId)) res.push(emp)
    }
    return res
  }

  return (
    <div className="w-full h-fit flex justify-between py-2">
      <div className="flex gap-5">
        <img
          src={getImage(reservation.restaurant.logo, DefaultImage)}
          alt="restaurant logo"
          className="w-32 h-32 rounded-lg"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-mont-bd">
            {reservation.restaurant.name} {reservation.restaurant.city}
          </h1>

          <div className="flex gap-2">
            <h1 className="text-sm">
              {reservation.orders.length > 0
                ? `${t('reservation.items')}: ${reservation.orders.length} ${t('reservation.for')} ${totalCost}zł`
                : t('reservation.no-orders')}
              ,
            </h1>
            <h1 className="text-sm">
              {format(new Date(reservation.reservationDate), 'dd.MM HH:mm')}
            </h1>
          </div>
          <div className="flex flex-col gap-2 p-2">
            {orders.map(order =>
              order.items.map(item => (
                <div
                  key={item.menuItem.menuItemId}
                  className="flex gap-3 items-center"
                >
                  <div className="flex items-center justify-center w-6 h-6 border-[1px] border-grey-0">
                    <h1 className="text-sm">{item.amount}</h1>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm">
                      {item.menuItem.name} {item.totalCost}zł
                    </h1>
                    <h1 className="text-[12px]">{`${item.menuItem.alternateName ?? ''}${item.menuItem.alcoholPercentage !== null ? `${item.menuItem.alcoholPercentage}‰` : ''}`}</h1>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {reservationType === ReservationListType.Incoming && (
        <div className="flex flex-col gap-2">
          <button
            className={`text-sm px-4 border-[1px] dark:bg-black  rounded-md p-2 border-grey-0 bg-grey-0 transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
            onClick={() => setIsCancelDialogOpen(true)}
          >
            {t('reservation.cancle')}
          </button>
        </div>
      )}
      {reservationType === ReservationListType.Finished && (
        <>
          <div className="flex flex-col gap-2">
            <button
              className={`text-sm px-4 border-[1px] dark:bg-black  rounded-md p-2 border-grey-0 bg-grey-0 transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
              onClick={() => setIsComplaining(true)}
            >
              {t('reservation.report')}
            </button>
          </div>
          <Dialog
            open={isComplaining}
            onClose={() => {
              setIsComplaining(false)
              setErrorMessage('')
            }}
            title={t('reservation.report-title')}
          >
            <div className="flex flex-col gap-4 dark:text-grey-1 p-4 w-[400px]">
              <label htmlFor="report-type" className="text-sm font-bold">
                {t('reservation.complain-topic')}?
              </label>
              <select
                id="report-type"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="border-[1px] rounded-md p-2 dark:bg-black"
              >
                <option
                  value=""
                  disabled
                  className="dark:text-grey-1 dark:bg-black"
                >
                  {t('reservation.select')}
                </option>
                <option
                  value="lost-item"
                  className="dark:text-grey-1 dark:bg-black"
                >
                  {t('reservation.lost-item')}
                </option>
                {/* <option
                  value="complain-order"
                  className="dark:text-grey-1 dark:bg-black"
                >
                  {t('reservation.order')}
                </option> */}
                {reservation.orders.length > 0 && (
                  <option
                    value="complain-employee"
                    className="dark:text-grey-1 dark:bg-black"
                  >
                    {t('reservation.employee')}
                  </option>
                )}
              </select>

              {reportType === 'complain-employee' && (
                <>
                  <label
                    htmlFor="employee-select"
                    className="text-sm font-bold"
                  >
                    {t('reservation.employee-select')}
                  </label>
                  <select
                    id="employee-select"
                    value={selectedEmployee}
                    onChange={e => setSelectedEmployee(e.target.value)}
                    className="border-[1px] rounded-md p-2 dark:bg-black"
                  >
                    <option
                      value=""
                      className="dark:text-grey-1 dark:bg-black"
                      disabled
                    >
                      {t('reservation.employee-select')}
                    </option>
                    {allReservationEmployees().map((emp: UserType) => (
                      <option
                        key={emp.userId}
                        value={emp.userId}
                        className="dark:text-grey-1 dark:bg-black"
                      >
                        {emp.firstName + ' ' + emp.lastName}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label htmlFor="report-note" className="text-sm font-bold">
                {t('reservation.details')}
              </label>
              <textarea
                id="report-note"
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
                placeholder={t('reservation.describe-details')}
                className="border-[1px] rounded-md p-2 h-20 scroll dark:text-grey-1 dark:bg-black"
              />
              {errorMessage && <ErrorMes msg={errorMessage} />}
              <button
                type="submit"
                onClick={() => {
                  if (validate()) handleReportSubmit()
                }}
                className="bg-primary text-white rounded-md p-2 transition hover:bg-secondary"
              >
                {t('reservation.submit')}
              </button>
            </div>
          </Dialog>
        </>
      )}
      <Dialog
        open={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        title={t('reservation.cancel-reservation-title')}
      >
        <div className="flex flex-col gap-4 p-4 dark:text-white">
          <p className="font-mont-bd">
            {t('reservation.cancel-reservation-dialog')}
          </p>
          <div className="flex gap-5">
            <img
              src={getImage(reservation.restaurant.logo, DefaultImage)}
              alt="restaurant logo"
              className="w-32 h-32 rounded-lg"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-mont-bd">
                {reservation.restaurant.name} {reservation.restaurant.city}
              </h1>
              <h1 className="text-sm">
                {reservation.orders.length > 0
                  ? `${reservation.orders.length} ${t('reservation.items')}, `
                  : `${t('reservation.cancel-no-orders')}`}
                {format(new Date(reservation.reservationDate), 'dd.MM HH:mm')}
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-2">
            {reservation.orders.length > 0 &&
              orders.map(order =>
                order.items.map(item => (
                  <div
                    key={item.menuItem.menuItemId}
                    className="flex gap-3 items-center"
                  >
                    <div className="flex items-center justify-center w-6 h-6 border-[1px] border-grey-0">
                      <h1 className="text-sm">{item.amount}</h1>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-sm">
                        {item.menuItem.name} {item.totalCost}zł
                      </h1>
                      <h1 className="text-[12px]">
                        {item.menuItem.alternateName ?? ''}
                        {item.menuItem.alcoholPercentage !== null
                          ? ` ${item.menuItem.alcoholPercentage}‰`
                          : ''}
                      </h1>
                    </div>
                  </div>
                ))
              )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              className="text-sm px-4 border-[1px] dark:bg-black  rounded-md p-2 border-grey-0 bg-grey-0 transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={handleCancelReservation}
            >
              {t('reservation.cancel-cancel')}
            </button>
          </div>
        </div>
        </Dialog>

    </div>
  )
}

export default Reservation
