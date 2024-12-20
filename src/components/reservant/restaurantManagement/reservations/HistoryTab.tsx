import OrderHistory from './OrderHistory'
import React, { useEffect, useState } from 'react'
import {
  GridRowsProp,
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridActionsCellItem
} from '@mui/x-data-grid'
import { fetchGET } from '../../../../services/APIconn'
import { FetchError } from '../../../../services/Errors'
import { OrderType, VisitType } from '../../../../services/types'
import { ArrowForwardIos } from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useParams } from 'react-router-dom'

const HistoryTab: React.FC = ({}) => {
  const [ordersOpen, setOrdersOpen] = useState<boolean>(false)
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [rows, setRows] = useState<GridRowsProp>([])
  const [activeOrders, setActiveOrders] = useState<OrderType[]>([])
  const [activeVisitId, setActiveVisitId] = useState<number | null>(null)

  const { restaurantId } = useParams()

  const activeRestaurantId =
    restaurantId === undefined ? -1 : parseInt(restaurantId)

  useEffect(() => {
    const populateRows = async () => {
      try {
        const response = await fetchGET(
          `/restaurants/${activeRestaurantId}/visits`
        )
        let tmp: VisitType[] = []
        let indx = 0
        for (const i in response.items) {
          tmp.push({
            id: Number(indx++),
            clientId: response.items[i].clientId,
            date: response.items[i].date,
            deposit: response.items[i].deposit,
            endTime: response.items[i].endTime,
            numberOfGuests: response.items[i].numberOfGuests,
            orders: response.items[i].orders,
            participants: response.items[i].participants,
            paymentTime: response.items[i].paymentTime,
            reservationDate: response.items[i].reservationDate,
            restaurant: response.items[i].restaurant,
            tableId: response.items[i].tableId,
            takeaway: response.items[i].takeaway,
            tip: response.items[i].tip,
            visitId: response.items[i].visitId
          })
        }
        setRows(tmp)
      } catch (error) {
        if (error instanceof FetchError) {
          console.log(error.formatErrors())
        } else {
          console.log('Unexpected error')
        }
      }
    }
    populateRows()
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'visitId',
      headerName: 'Visit ID',
      width: 150,
      editable: false,
      type: 'string'
    },
    {
      field: 'date',
      headerName: 'Started at',
      width: 200,
      editable: false,
      type: 'string'
    },
    {
      field: 'endTime',
      headerName: 'Finished at',
      width: 200,
      editable: false,
      type: 'string'
    },
    {
      field: 'reservationDate',
      headerName: 'Date of reservation',
      width: 200,
      editable: false,
      type: 'string'
    },
    {
      field: 'paymentTime',
      headerName: 'Date of payment',
      width: 200,
      editable: false,
      type: 'string'
    },
    {
      field: 'deposit',
      headerName: 'Deposit amount',
      width: 150,
      editable: false,
      type: 'number'
    },
    {
      field: 'tip',
      headerName: 'Tip',
      width: 150,
      editable: false,
      type: 'number'
    },
    {
      field: 'takeaway',
      headerName: 'Takeaway?',
      width: 150,
      editable: false,
      type: 'boolean'
    },
    {
      field: 'numberOfGuests',
      headerName: 'Number of guests',
      width: 150,
      editable: false,
      type: 'number'
    },
    {
      field: 'tableId',
      headerName: 'Table number',
      width: 150,
      editable: false,
      type: 'number'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Details',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<ArrowForwardIos />}
            label="Details"
            id={
              'VisitSeeDetailsButton' +
              rows[parseInt(id.toString())].id +
              rows[parseInt(id.toString())].name
            }
            className="textPrimary"
            onClick={() => {
              setActiveOrders(rows[parseInt(id.toString())].orders)
              setActiveVisitId(rows[parseInt(id.toString())].visitId)
              setOrdersOpen(true)
            }}
            color="inherit"
          />
        ]
      }
    }
  ]

  return (
    <div className="h-full w-full flex-col space-y-2 rounded-lg bg-white dark:bg-black">
      {!ordersOpen ? (
        <div className="h-full w-full rounded-lg bg-white dark:bg-black">
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } }
            }}
            pageSizeOptions={[5, 10, 25]}
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <div className="h-full w-full rounded-lg bg-white dark:bg-black">
          <div className="flex items-center  gap-6">
            <button
              onClick={() => setOrdersOpen(false)}
              className=" m-3 flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            >
              <ArrowBackIcon />
              <h1 className="text-md font-mont-md"> Back </h1>
            </button>
            <h1 className="text-md font-mont-md dark:text-grey-0">
              {' '}
              Visit {activeVisitId ? activeVisitId : ''} orders{' '}
            </h1>
          </div>
          <div className="">
            <OrderHistory orders={activeOrders} />
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryTab
