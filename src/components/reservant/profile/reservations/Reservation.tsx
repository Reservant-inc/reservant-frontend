import React, { useState, useEffect } from 'react'
import { OrderType, VisitType, ReportType } from '../../../../services/types'
import { fetchGET, getImage, fetchPOST } from '../../../../services/APIconn'
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'
import { FetchError } from '../../../../services/Errors'
import { format } from 'date-fns'
import Dialog from '../../../reusableComponents/Dialog'
import { ReservationListType } from '../../../../services/enums'

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
      if (error instanceof FetchError) console.error(error.formatErrors())
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

  const handleReportSubmit = async () => {
    try {
      let endpoint = ''
      let reportData: ReportType = {
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
          if (!selectedEmployee) {
            alert('Please select an employee to report.')
            return
          }
          endpoint = '/reports/report-employee'
          reportData = {
            ...reportData,
            reportedUserId: selectedEmployee
          }
          break
        default:
          alert('Please select a valid report type.')
          return
      }

      console.log(reportData)

      await fetchPOST(endpoint, JSON.stringify(reportData))
      alert('Your report has been submitted successfully.')
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
              className={`text-sm px-4 border-[1px] rounded-md p-2 border-grey-0 bg-grey-0 transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
              onClick={() => setIsComplaining(true)}
            >
              Report a problem
            </button>
          </div>
          <Dialog
            open={isComplaining}
            onClose={() => setIsComplaining(false)}
            title="Make a complaint"
          >
            <div className="flex flex-col gap-4 p-4 w-[400px]">
              <label htmlFor="report-type" className="text-sm font-bold">
                What is your report about?
              </label>
              <select
                id="report-type"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="border-[1px] rounded-md p-2"
              >
                <option value="" disabled>
                  Select a report type
                </option>
                <option value="lost-item">Lost item</option>
                <option value="complain-order">Complain about an order</option>
                <option value="complain-employee">
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
                className="border-[1px] rounded-md p-2 h-20 scroll"
              />

              <button
                onClick={handleReportSubmit}
                className="bg-primary text-white rounded-md p-2 transition hover:bg-secondary"
              >
                Submit Report
              </button>
            </div>
          </Dialog>
        </>
      )}
    </div>
  )
}

export default Reservation
