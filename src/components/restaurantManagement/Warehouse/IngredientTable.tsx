import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridSlots,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { fetchGET, fetchPOST } from "../../../services/APIconn";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";

interface IngredientTableProps {
  activeRestaurantId: number | null;
}

const IngredientTable: React.FC<IngredientTableProps> = ({ activeRestaurantId }) => {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroceryListOpen, setIsGroceryListOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [groceryList, setGroceryList] = useState<any[]>([]);
  const [formValues, setFormValues] = useState({
    name: "",
    unitOfMeasurement: "Gram",
    minimalAmount: "",
    amount: "",
  });

  const [t] = useTranslation("global");

  useEffect(() => {
    if (activeRestaurantId) {
      fetchIngredients();
    }
  }, [activeRestaurantId]);

  const fetchIngredients = async () => {
    try {
      const data = await fetchGET(
        `/restaurants/${activeRestaurantId}/ingredients?page=0&perPage=10`,
      );
      setIngredients(data.items);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
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
          amountToOrder: neededAmount > 0 ? neededAmount : 0,
        };
      });
    setGroceryList(restockingItems);
    setIsGroceryListOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormValues({
      name: "",
      unitOfMeasurement: "Gram",
      minimalAmount: "",
      amount: "",
    });
  };

  const handleAddIngredient = async () => {
    try {
      const payload = {
        publicName: formValues.name,
        unitOfMeasurement: formValues.unitOfMeasurement,
        minimalAmount: Number(formValues.minimalAmount),
        amountToOrder: 0,
        amount: formValues.amount ? Number(formValues.amount) : 0,
        menuItem: {
          menuItemId: 2,
          amountUsed: 1,
        },
      };

      await fetchPOST(`/restaurants/${activeRestaurantId}/ingredients`, JSON.stringify(payload));
      handleCloseModal();
      fetchIngredients();
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  const handleIncreaseAmount = (id: number) => {
    setGroceryList((prevList) =>
      prevList.map((item) =>
        item.id === id
          ? { ...item, amountToOrder: Math.min(item.amountToOrder + 1, 9999) }
          : item,
      ),
    );
  };

  const handleDecreaseAmount = (id: number) => {
    setGroceryList((prevList) =>
      prevList.map((item) =>
        item.id === id
          ? { ...item, amountToOrder: Math.max(item.amountToOrder - 1, 0) }
          : item,
      ),
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
            (ingredient) => ingredient.publicName === item.publicName,
          )?.ingredientId,
          amountOrdered: item.amountToOrder,
          amountDelivered: item.amountToOrder,
          expiryDate: null,
          storeName: item.publicName,
        })),
      };

      const response = await fetchPOST(`/deliveries`, JSON.stringify(orderPayload));

      const deliveryId = response.deliveryId;
      setInfoMessage(`${t("warehouse.delivery-confirmation")} ${deliveryId}`);
      setIsInfoDialogOpen(true);
      setIsGroceryListOpen(false);
    } catch (error) {
      console.error("Error sending order:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "publicName", headerName: `${t("warehouse.name")}`, flex: 1, sortable: true },
    {
      field: "amount",
      headerName: `${t("warehouse.quantity")}`,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "minimalAmount",
      headerName: `${t("warehouse.minimal-quantity")}`,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "state",
      headerName: `${t("warehouse.state")}`,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params.row.amount > params.row.minimalAmount ? (
          <span className="text-black dark:text-white">Enough in stock</span>
        ) : (
          <span className="w-full rounded bg-primary dark:bg-secondary p-2 text-center text-white">
            {t("warehouse.needs-restocking")}
          <span className="w-full rounded bg-white dark:bg-black border-[1px] border-error p-2 text-center text-black dark:text-white">
            {t("warehouse.needs-restocking")}
          </span>
        ),
    },
    {
      field: "daysTillExpiration",
      headerName: `${t("warehouse.till-expiration")}`,
      flex: 1,
      valueGetter: () => 1, // hardcoded
      sortable: true,
      disableColumnMenu: true,
    },
    { field: "unitOfMeasurement", headerName: `${t("warehouse.unit")}`, flex: 1, sortable: true },
    {
      field: "edit",
      headerName: `${t("warehouse.edit")}`,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => console.log("Edit clicked for id:", params.id)}
          color="inherit"
        />
      ),
    },
  ];

  const groceryListColumns: GridColDef[] = [
    { field: "publicName", headerName: `${t("warehouse.grocery-name")}`, flex: 1 },
    {
      field: "amountToOrder",
      headerName: `${t("warehouse.grocery-amount")}`,
      flex: 1,
      editable: true,
      type: "number",
    },
    {
      field: "actions",
      type: "actions",
      headerName: `${t("warehouse.grocery-actions")}`,
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<RemoveIcon />}
          label="Decrease"
          onClick={() => handleDecreaseAmount(params.id as number)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<AddCircleOutlineIcon />}
          label="Increase"
          onClick={() => handleIncreaseAmount(params.id as number)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleRemoveItem(params.id as number)}
          color="inherit"
        />,
      ],
    },
  ];

  const EditToolbar = () => (
    <GridToolbarContainer>
      <div className="flex w-full items-center justify-between">
        <div className="z-1 flex h-[3rem] items-center gap-2 p-1">
          <button
            id="RestaurantListAddRestaurantButton"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
          >
            <AddIcon />
            <h1 className="font-mont-md text-md">{t("warehouse.add-ingredient")}</h1>
          </button>

          <button
            id="GenerateGroceryListButton"
            onClick={handleGenerateGroceryList}
            className="flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
          >
            <h1 className="font-mont-md text-md">{t("warehouse.generate-list")}</h1>
          </button>
        </div>
      </div>
    </GridToolbarContainer>
  );

  return (
    <div className="h-full w-full rounded-lg bg-white dark:bg-black flex flex-col">
      <DataGrid
        rows={ingredients.map((ingredient, index) => ({
          ...ingredient,
          id: index,
        }))}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        slots={{ toolbar: EditToolbar as GridSlots["toolbar"] }}
      />
      {/* Formularz dodawania składnika */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add New Ingredient</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-3">
            <label className="text-sm">{t("warehouse.new-name")}</label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleFormChange}
              className="w-full p-2 border border-grey-2 rounded dark:bg-grey-5 dark:text-white"
              required
            />

            <label className="text-sm">{t("warehouse.new-unit")}</label>
            <select
              name="unitOfMeasurement"
              value={formValues.unitOfMeasurement}
              onChange={handleFormChange}
              className="w-full p-2 border border-grey-2 rounded dark:bg-grey-5 dark:text-white"
            >
              <option value="Gram">Gram</option>
              <option value="Liter">Liter</option>
              <option value="Unit">Unit</option>
            </select>

            <label className="text-sm">{t("warehouse.new-minimal")}</label>
            <input
              type="number"
              name="minimalAmount"
              value={formValues.minimalAmount}
              onChange={handleFormChange}
              className="w-full p-2 border border-grey-2 rounded dark:bg-grey-5 dark:text-white"
              required
            />

            <label className="text-sm">{t("warehouse.new-amount")}</label>
            <input
              type="number"
              name="amount"
              value={formValues.amount}
              onChange={handleFormChange}
              className="w-full p-2 border border-grey-2 rounded dark:bg-grey-5 dark:text-white"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button className="text-primary dark:text-secondary" onClick={handleCloseModal}>
          {t("warehouse.new-cancel")}
          </Button>
          <Button className="text-primary dark:text-secondary" onClick={handleAddIngredient}>
          {t("warehouse.new-add")}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Wysuwana lista zakupów */}
      {isGroceryListOpen && (
  <div className="fixed bottom-0 left-0 mb-4 flex w-[900px] flex-col rounded-lg bg-white dark:bg-grey-6 p-4 shadow-lg"
       style={{ maxHeight: '60vh' }} 
  >
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-mont-md text-2xl text-primary dark:text-secondary">{t("warehouse.grocery-list")}</h2>
      <div className="flex items-center gap-4">
        <button
          className="rounded bg-primary dark:bg-secondary px-6 py-3 text-xl text-white hover:bg-primary-2 dark:hover:bg-secondary-2"
          onClick={handleOrder}
        >
          {t("warehouse.grocery-order")}
        </button>
        <button
          className="text-primary dark:text-secondary"
          onClick={() => setIsGroceryListOpen(false)}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
    <div style={{ overflowY: 'auto' }}> {/* Przewijanie jeśli sie nie mieści */}
      <DataGrid
        rows={groceryList}
        columns={groceryListColumns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          "& .MuiDataGrid-cell": {
            fontSize: "18px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "20px",
          },
        }}
      />
    </div>
  </div>
)}


      {/* Dialog o poprawnym zamówieniu */}
      <Dialog
        open={isInfoDialogOpen}
        onClose={() => setIsInfoDialogOpen(false)}
      >
        <DialogTitle>{t("warehouse.confirmation")}</DialogTitle>
        <DialogContent>
          <p>{infoMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button
            className="text-primary dark:text-secondary"
            onClick={() => {
              setIsInfoDialogOpen(false);
              fetchIngredients();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IngredientTable;
