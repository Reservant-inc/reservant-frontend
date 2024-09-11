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
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { fetchGET, fetchPOST } from "../../../services/APIconn";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";

const IngredientTable: React.FC = () => {
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

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const data = await fetchGET(
        `/restaurants/1/ingredients?page=0&perPage=10`,
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          menuItemId: 2, // TODO na spotkaniu: Czy dodajemy skladniki od strony menuitem czy odwrotnie?
          amountUsed: 1,
        },
      };

      await fetchPOST(`/ingredients`, JSON.stringify(payload));
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
        restaurantId: 1,
        ingredients: groceryList.map((item) => ({
          deliveryId: 0, // po co to tutaj
          ingredientId: ingredients.find(
            (ingredient) => ingredient.publicName === item.publicName,
          )?.ingredientId,
          amountOrdered: item.amountToOrder,
          amountDelivered: item.amountToOrder,
          expiryDate: null, // skad mam to wiedziec skladajac zamowienie? spytac
          storeName: item.publicName,
        })),
      };

      const response = await fetchPOST(
        `/deliveries`,
        JSON.stringify(orderPayload),
      );

      console.log("Request:", orderPayload);
      console.log("Response:", response);

      const deliveryId = response.deliveryId;
      setInfoMessage(`Delivery request sent. Delivery Id: ${deliveryId}`);
      setIsInfoDialogOpen(true);
      setIsGroceryListOpen(false);
    } catch (error) {
      console.error("Error sending order:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "publicName", headerName: "Name", flex: 1, sortable: true },
    {
      field: "amount",
      headerName: "Quantity",
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "minimalAmount",
      headerName: "Minimal quantity",
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "state",
      headerName: "State",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params.row.amount > params.row.minimalAmount ? (
          <span>Enough in stock</span>
        ) : (
          <span className="w-full rounded bg-primary p-2 text-center text-white">
            Needs restocking
          </span>
        ),
    },
    {
      field: "daysTillExpiration",
      headerName: "Days till expiration",
      flex: 1,
      valueGetter: () => 1, // hardcoded
      sortable: true,
      disableColumnMenu: true,
    },
    { field: "unitOfMeasurement", headerName: "Unit", flex: 1, sortable: true },
    {
      field: "edit", // Jak wyglada edycja np. Amount skladnika? Ten guzik otwieralby form na PUTa, jesli potrzebne
      headerName: "Edit",
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
    { field: "publicName", headerName: "Name", flex: 1 },
    {
      field: "amountToOrder",
      headerName: "Amount to Order",
      flex: 1,
      editable: true,
      type: "number",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
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
  // Toolbar z przyciskami. Mozna dodac input do filtrowania, jesli to dostarczane przez mui nie jest OK
  const EditToolbar = () => (
    <GridToolbarContainer>
      <div className="flex w-full items-center justify-between">
        <div className="z-1 flex h-[3rem] items-center gap-2">
          <button
            id="IngredientAddButton"
            onClick={() => setIsModalOpen(true)}
            className="flex h-full items-center justify-center gap-2 rounded-lg p-2 text-primary hover:bg-grey-1"
          >
            <AddIcon />
            <h1 className="font-mont-md text-lg">Add ingredient</h1>
          </button>
          <button
            id="GenerateGroceryListButton"
            onClick={handleGenerateGroceryList}
            className="flex h-full items-center justify-center gap-2 rounded-lg bg-primary p-2 text-white hover:bg-primary-2"
          >
            <h1 className="font-mont-md text-lg">Generate grocery list</h1>
          </button>
        </div>
      </div>
    </GridToolbarContainer>
  );

  return (
    <div className="h-full w-full rounded-lg bg-white shadow-md">
      <DataGrid
        rows={ingredients.map((ingredient, index) => ({
          ...ingredient,
          id: index,
        }))}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        autoHeight
        slots={{ toolbar: EditToolbar as GridSlots["toolbar"] }}
      />
      {/* Formularz dodawania składnika */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add New Ingredient</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={formValues.name}
            onChange={handleFormChange}
          />
          <TextField
            select
            margin="dense"
            name="unitOfMeasurement"
            label="Unit of measurement"
            fullWidth
            value={formValues.unitOfMeasurement}
            onChange={handleFormChange}
          >
            <MenuItem value="Gram">Gram</MenuItem>
            <MenuItem value="Liter">Liter</MenuItem>
            <MenuItem value="Unit">Unit</MenuItem>
          </TextField>
          <TextField
            required
            margin="dense"
            name="minimalAmount"
            label="Minimal amount"
            fullWidth
            value={formValues.minimalAmount}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount (optional)"
            fullWidth
            value={formValues.amount}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button className="text-primary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button className="text-primary" onClick={handleAddIngredient}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Wysuwana lista zakupów */}
      {isGroceryListOpen && (
        <div className="fixed bottom-0 left-0 mb-4 flex h-[800px] w-[900px] flex-col rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mont-md text-2xl text-primary">Grocery list</h2>
            <div className="flex items-center gap-4">
              <button
                className="rounded bg-primary px-6 py-3 text-xl text-white hover:bg-primary-2"
                onClick={handleOrder}
              >
                Order
              </button>
              <button
                className="text-primary"
                onClick={() => setIsGroceryListOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
          </div>
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
      )}

      {/* Dialog o poprawnym zamówieniu */}
      <Dialog
        open={isInfoDialogOpen}
        onClose={() => setIsInfoDialogOpen(false)}
      >
        <DialogTitle>Information</DialogTitle>
        <DialogContent>
          <p>{infoMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button
            className="text-primary"
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
