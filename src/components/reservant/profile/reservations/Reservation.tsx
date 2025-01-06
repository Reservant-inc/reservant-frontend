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
import { Alert, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ErrorMes from '../../../reusableComponents/ErrorMessage'
import { report } from 'node:process'

interface ReservationProps {
  reservation: VisitType
  reservationType: ReservationListType
}

const Reservation: React.FC<ReservationProps> = ({
  reservation,
  reservationType
}) => {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [isComplaining, setIsComplaining] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [reportType, setReportType] = useState<string>('')
  const [reportNote, setReportNote] = useState<string>('')
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

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
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error')
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

  //@todo split into validation and submit; change alert into errorMes

  const validate = () => {
    if (!reportType) {
      setErrorMessage('Please select a valid report type.')
      return false
    } else if (reportType === 'complain-employee') {
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

      console.log(reportData)

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

  const handleCancelReservation = () => {}

  const allReservationEmployees = () => {
    let res: UserType[] = []
    console.log(reservation)
    for (let index = 0; index < orders.length; index++) {
      const employees: UserType[] = orders[index].employees
      for (let index = 0; index < employees?.length; index++) {
        const emp = employees[index]
        if (!res.find(e => e.userId === emp.userId)) res.push(emp)
      }
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
                ? `Pozycje: ${reservation.orders.length} za ${totalCost}zł`
                : 'Brak zamówień'}
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
            onClick={() => handleCancelReservation()}
          >
            Cancel a reservation
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
              Report a problem
            </button>
          </div>
          <Dialog
            open={isComplaining}
            onClose={() => {
              setIsComplaining(false)
              setErrorMessage('')
            }}
            title="Make a complaint"
          >
            <div className="flex flex-col gap-4 dark:text-grey-1 p-4 w-[400px]">
              <label htmlFor="report-type" className="text-sm font-bold">
                What is your report about?
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
                  Select a report type
                </option>
                <option
                  value="lost-item"
                  className="dark:text-grey-1 dark:bg-black"
                >
                  Lost item
                </option>
                {/* <option
                  value="complain-order"
                  className="dark:text-grey-1 dark:bg-black"
                >
                  Complain about an order
                </option> */}
                <option
                  value="complain-employee"
                  className="dark:text-grey-1 dark:bg-black"
                >
                  Complain about an employee
                </option>
              </select>

              {reportType === 'complain-employee' && (
                <>
                  <label
                    htmlFor="employee-select"
                    className="text-sm font-bold"
                  >
                    Select an employee
                  </label>
                  <select
                    id="employee-select"
                    value={selectedEmployee}
                    onChange={e => setSelectedEmployee(e.target.value)}
                    className="border-[1px] rounded-md p-2"
                  >
                    <option value="" disabled>
                      Select an employee
                    </option>
                    {allReservationEmployees().map((emp: UserType) => (
                      <option key={emp.userId} value={emp.userId}>
                        {emp.firstName + ' ' + emp.lastName}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label htmlFor="report-note" className="text-sm font-bold">
                Additional details
              </label>
              <textarea
                id="report-note"
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
                placeholder="Describe your issue in detail..."
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
                Submit Report
              </button>
            </div>
          </Dialog>
        </>
      )}
      {alertMessage && (
        <div className="fixed bottom-2 left-2">
          <Alert
            variant="filled"
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertMessage('')
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertMessage}
          </Alert>
        </div>
      )}
    </div>
  )
}

export default Reservation
