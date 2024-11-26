import React from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useTranslation } from 'react-i18next';
import Dialog from '../../../reusableComponents/Dialog';

interface GroceryListDialogProps {
  open: boolean;
  onClose: () => void;
  groceryList: any[];
  availableIngredients: any[];
  selectedDropdownIngredient: string;
  onIngredientSelect: (value: string) => void;
  onAddToGroceryList: () => void;
  onIncreaseAmount: (id: number) => void;
  onDecreaseAmount: (id: number) => void;
  onRemoveItem: (id: number) => void;
  onSubmitOrder: () => void;
}

const GroceryListDialog: React.FC<GroceryListDialogProps> = ({
  open,
  onClose,
  groceryList,
  availableIngredients,
  selectedDropdownIngredient,
  onIngredientSelect,
  onAddToGroceryList,
  onIncreaseAmount,
  onDecreaseAmount,
  onRemoveItem,
  onSubmitOrder,
}) => {
  const { t } = useTranslation('global');

  const groceryListColumns: GridColDef[] = [
    {
      field: 'publicName',
      headerName: `${t('warehouse.grocery-name')}`,
      flex: 1,
    },
    {
      field: 'unitOfMeasurement',
      headerName: `${t('warehouse.unit')}`,
      flex: 1,
    },
    {
      field: 'amountToOrder',
      headerName: `${t('warehouse.grocery-amount')}`,
      flex: 1,
      editable: true,
      type: 'number',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: `${t('warehouse.grocery-actions')}`,
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          id='DecreaseIngredientAmount'
          icon={<RemoveIcon />}
          label="Decrease"
          onClick={() => onDecreaseAmount(params.id as number)}
          color="inherit"
        />,
        <GridActionsCellItem
          id='IncreaseIngredientAmount'
          icon={<AddCircleOutlineIcon />}
          label="Increase"
          onClick={() => onIncreaseAmount(params.id as number)}
          color="inherit"
        />,
        <GridActionsCellItem
          id='RemoveIngredientFromGrocery'
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => onRemoveItem(params.id as number)}
          color="inherit"
        />,
      ],
    },
  ];

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} title={t('warehouse.grocery-list')}>
      <div className="p-4" style={{ maxWidth: '75vw', width: '75vw' }}>
        <div className="mb-4 flex items-center gap-4 overflow-y-auto scroll">
          <select
            id='PickIngredientForGrocery'
            value={selectedDropdownIngredient}
            onChange={(e) => onIngredientSelect(e.target.value)}
            className="cursor-pointer flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-2 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            style={{ width: '300px' }}
          >
            <option
              value=""
              hidden // ukrycie defaultowego
            >
              {t('warehouse.select-ingredient')}
            </option>
            {availableIngredients.map((ingredient) => (
              <option key={ingredient.ingredientId} value={ingredient.publicName}>
                {ingredient.publicName}
              </option>
            ))}
          </select>
          <button
            id='AddIngredientToGrocery'
            className="cursor-pointer flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            onClick={onAddToGroceryList}
            disabled={!selectedDropdownIngredient}
          >
            + {t('warehouse.add-to-list')}
          </button>
        </div>
        {groceryList.length > 0 ? (
          <div className='overflow-y-auto scroll'>
            <DataGrid
              rows={groceryList}
              getRowId={(row) => row.id}
              columns={groceryListColumns}
              autoHeight
              disableRowSelectionOnClick
              slots={{ pagination: () => null }}
            />
            <div className="mt-4 flex justify-end">
              <button
                id='SubmitOrderGrocery'
                onClick={onSubmitOrder}
                className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              >
                {t('warehouse.grocery-order')}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-white">
            {t('warehouse.no-ingredients')}
          </p>
        )}
      </div>
    </Dialog>
  );
};

export default GroceryListDialog;
