import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridSlots,
  GridActionsCellItem
} from '@mui/x-data-grid';
import { fetchGET, fetchPOST } from '../../../../services/APIconn';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { IngredientType, PaginationType } from '../../../../services/types';
import EditIngredientDialog from './EditIngredientDialog';
import GroceryListDialog from './GroceryListDialog';
import GroceryInfoDialog from './GroceryInfoDialog';
import AddIngredientDialog from './AddIngredientDialog';

//Szymon TODO: Wyświetlanie Deliveries (w zakładce i potem Grid?), podmienić formularze na formiki
const IngredientTable: React.FC = () => {
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroceryListOpen, setIsGroceryListOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [groceryList, setGroceryList] = useState<any[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState<IngredientType[]>([]);
  const [selectedDropdownIngredient, setSelectedDropdownIngredient] = useState<string>('');
  const [formValues, setFormValues] = useState({
    name: '',
    unitOfMeasurement: 'Gram',
    minimalAmount: '',
    amount: ''
  });

  const [t] = useTranslation('global');

  const { restaurantId } = useParams();

  const activeRestaurantId = restaurantId === undefined ? -1 : parseInt(restaurantId);

  useEffect(() => {
    if (activeRestaurantId) {
      fetchIngredients();
    }
  }, [activeRestaurantId]);

  useEffect(() => {
    updateAvailableIngredients();
  }, [ingredients, groceryList]);

  const fetchIngredients = async () => {
    try {
      const data: PaginationType = await fetchGET(
        `/restaurants/${activeRestaurantId}/ingredients?page=0&perPage=10`
      );
      const items: IngredientType[] = data.items as IngredientType[];
      setIngredients(items);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const updateAvailableIngredients = () => {
    const groceryIds = groceryList.map((item) => item.ingredientId);
    const filteredIngredients = ingredients.filter(
      (ingredient) => !groceryIds.includes(ingredient.ingredientId)
    );
    setAvailableIngredients(filteredIngredients);
  };

  const handleAddToGroceryList = () => {
    const ingredientToAdd = availableIngredients.find(
      (ingredient) => ingredient.publicName === selectedDropdownIngredient
    );
  
    if (ingredientToAdd) {
      setGroceryList((prevList) => [
        ...prevList,
        {
          ...ingredientToAdd, // kopia składnika do grocery listy
          id: Date.now(), // unikalne id bo innaczej błedy sypie
          amountToOrder: ingredientToAdd.minimalAmount
        }
      ]);
      setSelectedDropdownIngredient('');
    }
  };
  
  const handleGenerateGroceryList = () => {
    const restockingItems = ingredients
      .filter((ingredient) => ingredient.amount < ingredient.minimalAmount)
      .map((ingredient, index) => {
        const neededAmount = ingredient.minimalAmount - ingredient.amount;
        return {
          ...ingredient,
          id: index,
          amountToOrder: neededAmount > 0 ? neededAmount : 0
        };
      });
    setGroceryList(restockingItems);
    setIsGroceryListOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormValues({
      name: '',
      unitOfMeasurement: 'Gram',
      minimalAmount: '',
      amount: ''
    });
  };

  // Nie wiem dlaczego to nie działa? Przesyła się poprawnie ale nie wyświetla się składnik
  const handleAddIngredient = async () => {
    try {
      const restaurantId = activeRestaurantId;
  
      if (restaurantId === -1) {
        console.error('Invalid restaurant ID');
        return;
      }
  
      const payload = {
        publicName: formValues.name,
        unitOfMeasurement: formValues.unitOfMeasurement,
        minimalAmount: Number(formValues.minimalAmount),
        amountToOrder: 0,
        amount: formValues.amount ? Number(formValues.amount) : 0,
        restaurantId: restaurantId,
      };
  
      console.log('dane:', payload); 
  
      const response = await fetchPOST(`/ingredients`, JSON.stringify(payload));
  
      if (response) {
        console.log('Ingredient added successfully:', response.ingredientId);
      } else {
        console.warn('New ingredient added but no response returned');
      }
  
      handleCloseModal();
      fetchIngredients();
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
  };
  
  

  const handleIncreaseAmount = (id: number) => {
    setGroceryList((prevList) =>
      prevList.map((item) =>
        item.id === id
          ? { ...item, amountToOrder: Math.min(item.amountToOrder + 1, 9999) }
          : item
      )
    );
  };

  const handleDecreaseAmount = (id: number) => {
    setGroceryList((prevList) =>
      prevList.map((item) =>
        item.id === id
          ? { ...item, amountToOrder: Math.max(item.amountToOrder - 1, 0) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setGroceryList((prevList) => prevList.filter((item) => item.id !== id));
  };

  const handleOrder = async () => {
    try {
      const orderPayload = {
        restaurantId: activeRestaurantId,
        ingredients: groceryList.map((item) => ({
          deliveryId: 0,
          ingredientId: ingredients.find(
            (ingredient) => ingredient.publicName === item.publicName
          )?.ingredientId,
          amountOrdered: item.amountToOrder,
          amountDelivered: item.amountToOrder,
          expiryDate: null,
          storeName: item.publicName,
        })),
      };
  
      const response = await fetchPOST(`/deliveries`, JSON.stringify(orderPayload));
      const deliveryId = response.deliveryId;
      setInfoMessage(`${t('warehouse.delivery-confirmation')} ${deliveryId}`);
      setIsInfoDialogOpen(true);
      setIsGroceryListOpen(false);
    } catch (error) {
      console.error('Error sending order:', error);
    }
  };

  const handleOpenEditDialog = (ingredient: IngredientType) => {
    setSelectedIngredient(ingredient);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedIngredient(null);
    setIsEditDialogOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'publicName',
      headerName: `${t('warehouse.name')}`,
      flex: 1,
      sortable: true
    },
    {
      field: 'amount',
      headerName: `${t('warehouse.quantity')}`,
      flex: 1,
      sortable: true,
      disableColumnMenu: true
    },
    {
      field: 'minimalAmount',
      headerName: `${t('warehouse.minimal-quantity')}`,
      flex: 1,
      sortable: true,
      disableColumnMenu: true
    },
    {
      field: 'state',
      headerName: `${t('warehouse.state')}`,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params.row.amount > params.row.minimalAmount ? (
          <span className="text-black dark:text-white">Enough in stock</span>
        ) : (
          <span className="w-full rounded border-[1px] border-error bg-white p-2 text-center text-black dark:bg-black dark:text-white">
            {t('warehouse.needs-restocking')}
          </span>
        )
    },
    {
      field: 'unitOfMeasurement',
      headerName: `${t('warehouse.unit')}`,
      flex: 1,
      sortable: true
    },
    {
      field: 'edit',
      headerName: `${t('warehouse.edit')}`,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleOpenEditDialog(params.row)}
          color="inherit"
        />
      )
    }
  ];

  const EditToolbar = () => (
    <GridToolbarContainer>
      <div className="flex w-full items-center justify-between">
        <div className="z-1 flex h-[3rem] items-center gap-2 p-1">
          <button
            id="RestaurantListAddRestaurantButton"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            <h1 className="text-md font-mont-md">
              + {t('warehouse.add-ingredient')}
            </h1>
          </button>

          <button
            id="GenerateGroceryListButton"
            onClick={handleGenerateGroceryList}
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            <h1 className="text-md font-mont-md">
              {t('warehouse.generate-list')}
            </h1>
          </button>
        </div>
      </div>
    </GridToolbarContainer>
  );

  return (
    <div className="overflow-y-auto scroll flex h-full w-full flex-col rounded-lg bg-white dark:bg-black ">
      {ingredients.length > 0 ? (
        <div className=''>
        <DataGrid
          rows={ingredients.map((ingredient, index) => ({
            ...ingredient,
            id: index
          }))}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 100]}
          disableRowSelectionOnClick
          slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
        />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full text-lg text-gray-500 dark:text-gray-400 gap-4">
          <p className="text-black dark:text-white">{t('Ta restauracja nie ma żadnych składników')}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            + {t('warehouse.add-ingredient')} 
          </button>
        </div>
      )}

        {/* Dialog dodawania składnika nowego */}
        <AddIngredientDialog
          open={isModalOpen}
          onClose={handleCloseModal}
          formValues={formValues}
          onFormChange={handleFormChange}
          onAddIngredient={handleAddIngredient}
          t={t} 
        />
      
      {/* Dialog z listą zakupów  */}
      <GroceryListDialog
        open={isGroceryListOpen}
        onClose={() => setIsGroceryListOpen(false)}
        groceryList={groceryList}
        availableIngredients={availableIngredients}
        selectedDropdownIngredient={selectedDropdownIngredient}
        onIngredientSelect={(value) => setSelectedDropdownIngredient(value)}
        onAddToGroceryList={handleAddToGroceryList}
        onIncreaseAmount={handleIncreaseAmount}
        onDecreaseAmount={handleDecreaseAmount}
        onRemoveItem={handleRemoveItem}
        onSubmitOrder={handleOrder} // funkcja od zamówienia
      />;

      {/* Dialog do edycji składnika */}
      <EditIngredientDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        ingredient={selectedIngredient}
        onUpdate={fetchIngredients}
      />

      {/* Dialog z podsumowaniem złożenia delivery */}
      <GroceryInfoDialog
        open={isInfoDialogOpen}
        onClose={() => setIsInfoDialogOpen(false)}
        message={infoMessage}
        fetchIngredients={fetchIngredients}
      />
    </div>
  );
};

export default IngredientTable;
