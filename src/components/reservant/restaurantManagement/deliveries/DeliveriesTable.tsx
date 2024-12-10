import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { fetchGET } from '../../../../services/APIconn';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DeliveryActionDialog from './DeliveryActionDialog';
import DeliveryDetailsDialog from './DeliveryDetailsDialog';

const DeliveriesTable: React.FC = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<any[]>([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'delivered' | 'notDelivered'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const { restaurantId } = useParams();
  const [t] = useTranslation('global');

  const activeRestaurantId = restaurantId ? parseInt(restaurantId) : -1;

  useEffect(() => {
    if (activeRestaurantId !== -1) {
      fetchDeliveries();
    }
  }, [activeRestaurantId]);

  useEffect(() => {
    applyFilter();
  }, [deliveries, filter]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const deliveredResponse = await fetchGET(
        `/restaurants/${activeRestaurantId}/deliveries?returnDelivered=true&page=0&perPage=10`
      );
      const deliveredItems = deliveredResponse.items || [];

      const notDeliveredResponse = await fetchGET(
        `/restaurants/${activeRestaurantId}/deliveries?returnDelivered=false&page=0&perPage=10`
      );
      const notDeliveredItems = notDeliveredResponse.items || [];

      setDeliveries([...deliveredItems, ...notDeliveredItems]);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter === 'delivered') {
      setFilteredDeliveries(deliveries.filter((delivery) => delivery.deliveredTime !== null));
    } else if (filter === 'notDelivered') {
      setFilteredDeliveries(deliveries.filter((delivery) => delivery.deliveredTime === null));
    } else {
      setFilteredDeliveries(deliveries);
    }
  };

  const handleOpenActionDialog = (deliveryId: number, action: 'confirm' | 'cancel') => {
    setSelectedDeliveryId(deliveryId);
    setActionType(action);
    setIsActionDialogOpen(true);
  };

  const handleCloseActionDialog = () => {
    setSelectedDeliveryId(null);
    setActionType(null);
    setIsActionDialogOpen(false);
  };

  const handleOpenDetailsDialog = (deliveryId: number) => {
    setSelectedDeliveryId(deliveryId);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setSelectedDeliveryId(null);
    setIsDetailsDialogOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'deliveryId',
      headerName: `${t('delivery.delivery-id')}`,
      flex: 1,
      sortable: true,
    },
    {
      field: 'orderTime',
      headerName: `${t('delivery.order-time')}`,
      flex: 1,
      sortable: true,
    },
    {
      field: 'deliveredTime',
      headerName: `${t('delivery.delivered-time')}`,
      flex: 1,
      sortable: true,
    },
    {
      field: 'canceledTime',
      headerName: `${t('delivery.canceled-time')}`,
      flex: 1,
      sortable: true,
    },
    {
      field: 'actions',
      headerName: `${t('delivery.actions')}`,
      flex: 1.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const isDelivered = params.row.deliveredTime !== null;
        return (
          <div className="flex gap-2">
            <button
              disabled={isDelivered}
              onClick={() => handleOpenActionDialog(params.row.deliveryId, 'confirm')}
              className={`flex items-center justify-center rounded-md p-1 ${
                isDelivered ? 'text-black dark:text-white' : 'text-green dark:text-green'
              }`}
            >
              <CheckSharpIcon />
            </button>
            <button
              disabled={isDelivered}
              onClick={() => handleOpenActionDialog(params.row.deliveryId, 'cancel')}
              className={`flex items-center justify-center rounded-md p-1 ${
                isDelivered ? 'text-black dark:text-white' : 'text-red dark:text-red'
              }`}
            >
              <CloseSharpIcon />
            </button>
            <button
              onClick={() => handleOpenDetailsDialog(params.row.deliveryId)}
              className="flex items-center justify-center rounded-md p-1 text-primary dark:text-secondary"
            >
              <ManageSearchIcon />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="overflow-y-auto flex h-full w-full flex-col rounded-lg bg-white dark:bg-black">
        {/* Nagłówek i Dropdown do filtrowania */}
        <div className="flex items-center gap-4 p-4">
          <h1 className="text-lg font-semibold text-primary dark:text-secondary">
            {t('delivery.deliveries')}
          </h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'delivered' | 'notDelivered')}
            className="border-[1px] border-primary px-3 py-1 text-primary rounded-md hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            <option value="all">{t('delivery.filter-all')}</option>
            <option value="delivered">{t('delivery.filter-delivered')}</option>
            <option value="notDelivered">{t('delivery.filter-not-delivered')}</option>
          </select>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : filteredDeliveries.length > 0 ? (
          <DataGrid
            rows={filteredDeliveries.map((delivery, index) => ({
              ...delivery,
              id: delivery.deliveryId || index,
            }))}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 100]}
            disableRowSelectionOnClick
          />
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-lg gap-4">
            <p className="text-black dark:text-white">
              {t('delivery.no-deliveries')}
            </p>
          </div>
        )}
      </div>
      {selectedDeliveryId !== null && (
        <>
          <DeliveryActionDialog
            open={isActionDialogOpen}
            onClose={handleCloseActionDialog}
            deliveryId={selectedDeliveryId}
            action={actionType as 'confirm' | 'cancel'}
            onActionComplete={fetchDeliveries}
          />
          <DeliveryDetailsDialog
            open={isDetailsDialogOpen}
            onClose={handleCloseDetailsDialog}
            deliveryId={selectedDeliveryId}
          />
        </>
      )}
    </>
  );
};

export default DeliveriesTable;
