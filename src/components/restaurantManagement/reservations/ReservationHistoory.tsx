import React, { useEffect, useState } from "react";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DetailsIcon from "@mui/icons-material/Details";
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from "@mui/material";
import { fetchGET } from "../../../services/APIconn";

interface OrderHistoryProps {
  activeRestaurantId: number | null;
}

const ReservationHistory: React.FC<OrderHistoryProps> = ({ activeRestaurantId }) => {
  const [rows, setRows] = useState<GridRowsProp>([
    { id: 1, orderId: 'ORD001', visitId: "2024-05-29", cost: 50.0, status: 'Completed', employeeId: 'John Smith' },
    { id: 2, orderId: 'ORD002', visitId: "2024-05-29", cost: 75.0, status: 'Pending', employeeId: 'Emily Johnson' },
    { id: 3, orderId: 'ORD003', visitId: "2024-05-30", cost: 100.0, status: 'Cancelled', employeeId: 'Michael Davis' },
    { id: 4, orderId: 'ORD004', visitId: "2024-06-01", cost: 25.0, status: 'Completed', employeeId: 'Sarah Brown' },
    { id: 5, orderId: 'ORD005', visitId: "2024-06-01", cost: 60.0, status: 'Pending', employeeId: 'David Wilson' },
  ]);    
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  useEffect(() => {
    const populateRows = async () => {
      try {
        const response = await fetchGET(`/restaurants/${activeRestaurantId}/orders`);
        console.log(response);
        
      } catch (error) {
        console.error("Error populating table", error);
      }
    };
    populateRows();
  }, []);

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleDetailsClick = (orderId: string) => () => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
    // Tutaj możesz wykonać żądanie API, aby pobrać szczegóły zamówienia na podstawie orderId
    // fetchOrderDetails(orderId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: "orderId", headerName: "Order ID", width: 150, editable: false },
    { field: "visitId", headerName: "Visit Date", width: 150, editable: false },
    { field: "cost", headerName: "Cost", width: 150, editable: true },
    { field: "status", headerName: "Status", width: 150, editable: true },
    { field: "employeeId", headerName: "Employee", width: 150, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<DetailsIcon />}
            label="Details"
            onClick={handleDetailsClick(row.orderId)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="h-full w-full bg-white rounded-lg">
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
       
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        className="border-0"
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary="Order ID:" secondary={selectedOrderId} />
            </ListItem>
            {selectedOrderId && (
              <ListItem>
                <ListItemText primary="Visit Date:" secondary={rows.find(row => row.orderId === selectedOrderId)?.visitId} />
              </ListItem>
            )}
            {selectedOrderId && (
              <ListItem>
                <ListItemText primary="Items:" secondary=" items..." />
              </ListItem>
            )}
            {selectedOrderId && (
              <ListItem>
                <ListItemText primary="Cost:" secondary={rows.find(row => row.orderId === selectedOrderId)?.cost} />
              </ListItem>
            )}
            {selectedOrderId && (
              <ListItem>
                <ListItemText primary="Status:" secondary={rows.find(row => row.orderId === selectedOrderId)?.status} />
              </ListItem>
            )}
            {selectedOrderId && (
              <ListItem>
                <ListItemText primary="Employee:" secondary={rows.find(row => row.orderId === selectedOrderId)?.employeeId} />
              </ListItem>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationHistory;
