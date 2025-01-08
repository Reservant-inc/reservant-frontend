import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import { Tooltip, IconButton, ThemeProvider } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { fetchGET } from '../../../services/APIconn'
import { useNavigate, useParams } from 'react-router-dom'
import { RestaurantDetailsType } from '../../../services/types'
import { ThemeContext } from '../../../contexts/ThemeContext'
import PendingRestaurantDetails from './PendingRestaurantDetails'

const PendingRestaurantsList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<RestaurantDetailsType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const { isDark, lightTheme, darkTheme } = useContext(ThemeContext)

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await fetchGET('/restaurants/unverified');
      setRestaurants(response.items);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeSidePanel = () => {
    navigate('/customer-service/pending-restaurants');
  };

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.restaurantId === parseInt(restaurantId || '', 10)
  );

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      sortable: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      sortable: true,
    },
    {
      field: 'restaurantType',
      headerName: 'Type',
      flex: 1,
      sortable: true,
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 1,
      sortable: true,
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
      ),
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
              onClick={() => {
                navigate(`/customer-service/restaurants/${params.row.id}`)
              }}
            >
              <ChevronRightIcon color="action" />
            </IconButton>
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="h-full w-full flex flex-col">
      <h1 className="text-lg font-semibold p-2">Pending Restaurants</h1>
      <div className="flex gap-2 h-[calc(100%-44px)]">
        {/* Restaurants List */}
        <div
          className={`h-full ${
            restaurantId ? 'w-[calc(100%-400px)]' : 'w-full'
          } transition-all flex flex-col`}
        >
          <div className="flex-grow overflow-hidden bg-white dark:bg-black rounded-lg shadow-md">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <CircularProgress />
              </div>
            ) : restaurants.length > 0 ? (
              <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
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
              </ThemeProvider>
            ) : (
              <div className="flex justify-center items-center h-full text-lg">
                No pending restaurants found.
              </div>
            )}
          </div>
        </div>

        {/* Restaurant Details */}
        {restaurantId && selectedRestaurant && (
          <div className="h-full w-[400px] overflow-y-auto">
            <PendingRestaurantDetails
              restaurant={selectedRestaurant}
              onClose={closeSidePanel}
              fetchrestaurants={fetchRestaurants}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRestaurantsList;
