import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import { Tooltip, IconButton } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { fetchGET } from '../../../services/APIconn'
import { useNavigate, useParams } from 'react-router-dom'
import PendingRestaurantDetails from './PendingRestaurantDetails'

const PendingRestaurantsList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { restaurantId } = useParams<{ restaurantId: string }>()

  useEffect(() => {
    fetchrestaurants()
  }, [])

  useEffect(() => {
    if (restaurantId) {
      navigate('/customer-service/restaurants')
    }
  }, [restaurants])

  const fetchrestaurants = async () => {
    setLoading(true)
    try {
      const response = await fetchGET('/restaurants/unverified')
      setRestaurants(response.items)
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const closeSidePanel = () => {
    navigate('/customer-service/restaurants')
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      sortable: true
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip
          title={
            restaurantId === params.row.id.toString()
              ? 'Close Details'
              : 'View Details'
          }
        >
          <span>
            <IconButton
              onClick={() =>
                restaurantId === params.row.id.toString()
                  ? closeSidePanel()
                  : navigate(`/customer-service/restaurants/${params.row.id}`)
              }
              style={{
                visibility:
                  restaurantId && restaurantId !== params.row.id.toString()
                    ? 'hidden'
                    : 'visible'
              }}
            >
              {restaurantId === params.row.id.toString() ? (
                <ChevronLeftIcon color="action" />
              ) : (
                <ChevronRightIcon color="action" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )
    }
  ]

  return (
    <div className="h-full w-full flex flex-col">
      <h1 className="text-lg font-semibold p-2">Complaints</h1>
      <div className="flex gap-2 h-full">
        <div
          className={`h-full ${
            restaurantId ? 'w-[75%]' : 'w-full'
          } transition-all flex flex-col`}
        >
          <div className="flex-grow overflow-hidden bg-white rounded-lg shadow-md">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <CircularProgress />
              </div>
            ) : restaurants.length > 0 ? (
              <DataGrid
                rows={restaurants.map(restaurant => ({
                  id: restaurant.restaurantId
                }))}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                className="h-full"
              />
            ) : (
              <div className="flex justify-center items-center h-full text-lg">
                No complaints found.
              </div>
            )}
          </div>
        </div>
        {restaurantId && (
          <div className="h-full w-[25%] bg-gray-100 dark:bg-gray-800 overflow-y-auto scroll">
            {/* <PendingRestaurantDetails
              restaurant={selectedRestaurant}
              onClose={closeSidePanel}
            /> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default PendingRestaurantsList
