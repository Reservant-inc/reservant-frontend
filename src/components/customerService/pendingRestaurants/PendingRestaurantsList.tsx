import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import { Tooltip, IconButton } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { fetchGET } from '../../../services/APIconn'
import { useNavigate, useParams } from 'react-router-dom'
import PendingRestaurantDetails from './PendingRestaurantDetails'
import { RestaurantDetailsType } from '../../../services/types'

const PendingRestaurantsList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<RestaurantDetailsType[]>([])
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

  const selectedRestaurant = restaurants.find(
    restaurant => restaurant.restaurantId === parseInt(restaurantId || '', 10)
  )

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      sortable: true
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      sortable: true
    },
    {
      field: 'restaurantType',
      headerName: 'Type',
      flex: 1,
      sortable: true
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 1,
      sortable: true
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.row.description || 'No description'}>
          <span>
            {params.row.description?.length > 50
              ? `${params.row.description.substring(0, 50)}...`
              : params.row.description || 'No description'}
          </span>
        </Tooltip>
      )
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
      <h1 className="text-lg font-semibold p-2">Pending restaurants</h1>
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
                  id: restaurant.restaurantId,
                  name: restaurant.name,
                  restaurantType: restaurant.restaurantType,
                  city: restaurant.city,
                  description: restaurant.description
                }))}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                className="h-full"
              />
            ) : (
              <div className="flex justify-center items-center h-full text-lg">
                No pending restaurants found.
              </div>
            )}
          </div>
        </div>
        {restaurantId && (
          <div className="h-full w-[25%] bg-gray-100 dark:bg-gray-800 overflow-y-auto scroll">
            <PendingRestaurantDetails
              restaurant={selectedRestaurant}
              onClose={closeSidePanel}
              fetchrestaurants={fetchrestaurants}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PendingRestaurantsList
