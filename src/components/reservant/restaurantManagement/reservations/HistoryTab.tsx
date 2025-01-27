import React, { useEffect, useState } from 'react'
import { fetchGET, getImage } from '../../../../services/APIconn'
import { FetchError } from '../../../../services/Errors'
import { OrderType, VisitType } from '../../../../services/types'
import { useParams } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TableContainer
} from '@mui/material'
import {
  Check,
  Close,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight
} from '@mui/icons-material'
import Default from '../../../../assets/images/defaultMenuItemImage.png'
import { useTranslation } from 'react-i18next'

const HistoryTab: React.FC = ({}) => {
  const [visits, setVisits] = useState<VisitType[]>([])

  const { restaurantId } = useParams()

  const [t] = useTranslation('global')

  const activeRestaurantId =
    restaurantId === undefined ? -1 : parseInt(restaurantId)

  useEffect(() => {
    const populateRows = async () => {
      try {
        const response = await fetchGET(
          `/restaurants/${activeRestaurantId}/visits`
        )
        let tmp: VisitType[] = []
        for (const i in response.items) {
          let orders: OrderType[] = []

          try {
            for (const j in response.items[i].orders) {
              const fetchedOrder: OrderType = await fetchGET(
                `/orders/${response.items[i].orders[j].orderId}`
              )
              orders.push(fetchedOrder)
            }
          } catch (error) {
            if (error instanceof FetchError) {
              console.error(error.formatErrors())
            } else {
              console.error('Unexpected error')
            }
          }

          tmp.push({
            visitId: response.items[i].visitId,
            reservationDate: response.items[i].reservationDate
              ? new Date(response.items[i].reservationDate).toLocaleString()
              : '',
            date: response.items[i].date
              ? new Date(response.items[i].date).toLocaleString()
              : '',
            endTime: response.items[i].endTime
              ? new Date(response.items[i].endTime).toLocaleString()
              : '',
            paymentTime: response.items[i].paymentTime
              ? new Date(response.items[i].paymentTime).toLocaleString()
              : '',
            participants: response.items[i].participants,
            numberOfGuests: response.items[i].numberOfGuests,
            tip: response.items[i].tip,
            takeaway: response.items[i].takeaway,
            tableId: response.items[i].tableId,
            orders: orders,
            deposit: response.items[i].deposit,
            clientId: response.items[i].clientId,
            restaurant: response.items[i].restaurant
          })
        }
        setVisits(tmp)
      } catch (error) {
        if (error instanceof FetchError) {
          console.error(error.formatErrors())
        } else {
          console.error('Unexpected error')
        }
      }
    }
    populateRows()
  }, [])

  const RenderVisitRow = ({ visit }: { visit: VisitType }) => {
    const [open, setOpen] = useState(false)

    const toggleDetails = () => {
      setOpen(prev => !prev)
    }

    const ordersEarnings = visit.orders.reduce(
      (sum: number, order: OrderType) => sum + order.cost,
      0
    )

    return (
      <>
        <TableRow>
          <TableCell>
            {visit.orders.length ? (
              <IconButton
                aria-label="expand row"
                size="small"
                className="dark:text-grey-0"
                onClick={() => {
                  toggleDetails()
                }}
              >
                {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRight />}
              </IconButton>
            ) : (
              <></>
            )}
          </TableCell>
          <TableCell>{visit.visitId}</TableCell>
          <TableCell>{visit.reservationDate}</TableCell>
          <TableCell>{visit.date}</TableCell>
          <TableCell>{visit.endTime}</TableCell>
          <TableCell>{visit.orders.length}</TableCell>
          <TableCell>{ordersEarnings.toFixed(2)}</TableCell>
          <TableCell>{visit.tip ?? 0}</TableCell>
          <TableCell>{visit.takeaway ? <Check /> : <Close />}</TableCell>
          <TableCell>
            {visit.participants.length + visit.numberOfGuests}
          </TableCell>
          <TableCell>{visit.tableId}</TableCell>
        </TableRow>
        {open && (
          <TableRow className="bg-grey-0 dark:bg-grey-5">
            <TableCell colSpan={12}>
              <TableContainer>
                <h1 className="pt-3 pl-3 font-mont-bd text-lg">
                  {t('restaurant-management.visits.orders')}:
                </h1>

                <Table className="w-full">
                  <TableHead>
                    <TableCell>
                      {t('restaurant-management.visits.expand')}
                    </TableCell>
                    <TableCell>
                      {t('restaurant-management.visits.orderId')}
                    </TableCell>
                    <TableCell>
                      {t('restaurant-management.visits.assigned')}
                    </TableCell>
                    <TableCell>
                      {t('restaurant-management.visits.items-count')}
                    </TableCell>
                    <TableCell>
                      {t('restaurant-management.visits.earnings-items')}
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {visit.orders.map((order: OrderType) => (
                      <RenderOrderRow key={order.orderId} order={order} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TableCell>
          </TableRow>
        )}
      </>
    )
  }

  const RenderOrderRow = ({ order }: { order: OrderType }) => {
    const [open, setOpen] = useState(false)

    const toggleDetails = () => {
      setOpen(prev => !prev)
    }

    return (
      <>
        <TableRow>
          <TableCell>
            {order.items.length ? (
              <IconButton
                aria-label="expand row"
                size="small"
                className="dark:text-grey-0"
                onClick={() => {
                  toggleDetails()
                }}
              >
                {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRight />}
              </IconButton>
            ) : (
              <></>
            )}
          </TableCell>
          <TableCell>{order.orderId}</TableCell>
          <TableCell>
            {order.assignedEmployee.firstName +
              ' ' +
              order.assignedEmployee.lastName}
          </TableCell>
          <TableCell>{order.items.length}</TableCell>
          <TableCell>{order.cost}</TableCell>
        </TableRow>
        {open && (
          <TableRow className="bg-grey-1 dark:bg-grey-6">
            <TableCell colSpan={6}>
              <TableContainer>
                <h1 className="pt-3 pl-3 font-mont-bd text-lg">
                  {t('restaurant-management.visits.items')}:
                </h1>

                <Table className="w-full">
                  <TableHead>
                    <TableCell>
                      {t('restaurant-management.visits.image')}
                    </TableCell>
                    <TableCell>
                      {t('restaurant-management.visits.item-name')}{' '}
                    </TableCell>
                    <TableCell>
                      {t('restaurant-management.visits.one-item-price')}
                    </TableCell>
                    <TableCell>
                      {t('restaurant-management.visits.amount')}
                    </TableCell>
                    <TableCell>
                      {t('restaurant-management.visits.total')}
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {order.items.map(order => (
                      <TableRow>
                        <TableCell>
                          <img
                            src={getImage(order.menuItem.photo, Default)}
                            className="w-12 h-12"
                          />
                        </TableCell>
                        <TableCell>{order.menuItem.name}</TableCell>
                        <TableCell>{order.oneItemPrice}</TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>{order.totalCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TableCell>
          </TableRow>
        )}
      </>
    )
  }

  return (
    <div className="h-full overflow-y-auto scroll w-full flex-col space-y-2 rounded-lg bg-white dark:bg-black">
      <TableContainer>
        <h1 className="pt-3 pl-3 font-mont-bd text-lg">
          {t('restaurant-management.visits.visits')}:
        </h1>
        <Table>
          <TableHead>
            <TableCell>{t('restaurant-management.visits.expand')}</TableCell>
            <TableCell>{t('restaurant-management.visits.visitId')}</TableCell>
            <TableCell>{t('restaurant-management.visits.date')}</TableCell>
            <TableCell>{t('restaurant-management.visits.started')}</TableCell>
            <TableCell>{t('restaurant-management.visits.finished')}</TableCell>
            <TableCell>
              {t('restaurant-management.visits.orders-count')}
            </TableCell>
            <TableCell>{t('restaurant-management.visits.earnings')}</TableCell>
            <TableCell>{t('restaurant-management.visits.tip')}</TableCell>
            <TableCell>{t('restaurant-management.visits.takeaway')}</TableCell>
            <TableCell>{t('restaurant-management.visits.clients')}</TableCell>
            <TableCell>{t('restaurant-management.visits.table')}</TableCell>
          </TableHead>
          <TableBody>
            {visits.map((visit: VisitType) => (
              <RenderVisitRow key={visit.visitId} visit={visit} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default HistoryTab
