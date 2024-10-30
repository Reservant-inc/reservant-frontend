import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
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
import {
  EmploymentType,
} from "../../../services/types";
import { fetchDELETE, fetchGET, fetchPUT } from "../../../services/APIconn";


export default function EmploymentsManagement({ empid }: { empid: string }) {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});


  useEffect(() => {
    const populateRows = async () => {
      try {
        const response = await fetchGET("/user/employees");
        const tmp: EmploymentType[] = [];

        if (response.length)
          for (const i in response) {
            if (response[i].userId === empid)
              for (const j in response[i].employments) {
                tmp.push({
                  id: response[i].employments[j].employmentId,
                  restaurantName: response[i].employments[j].restaurantName,
                  restaurantId: response[i].employments[j].restaurantId,
                  isBackdoorEmployee: response[i].employments[j].isBackdoorEmployee,
                  isHallEmployee: response[i].employments[j].isHallEmployee,
                });
              }
          }

        setRows(tmp);
      } catch (error) {
        console.error("Error populating table", error);
      }
    };

    populateRows();
  }, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

 
  const handleDeleteClick = (id: GridRowId) => async () => {
    setRows(rows.filter((row) => row.id !== id));

    await fetchDELETE(`/employments/${id}`);
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

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    if (!(newRow.isHallEmployee || newRow.isBackdoorEmployee)) return;
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    const body = JSON.stringify([
      {
        employmentId: newRow.id,
        isBackdoorEmployee: newRow.isBackdoorEmployee,
        isHallEmployee: newRow.isHallEmployee,
      },
    ]);
    console.log(body);
    await fetchPUT("/employments", body);
    return updatedRow;
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const columns: GridColDef[] = [
    {
      field: "restaurantName",
      headerName: "Restaurant",
      type: "string",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "isHallEmployee",
      headerName: "Hall role",
      type: "boolean",
      width: 180,
      editable: true,
    },
    {
      field: "isBackdoorEmployee",
      headerName: "Backdoor role",
      type: "boolean",
      width: 180,
      editable: true,
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              id={"EmployeeManagementSaveButtonPopup" + id}
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              id={"EmployeeManagementCancelEditButtonPopup" + id}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            id={"EmployeeManagementEditButtonPopup" + id}
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            id={"EmployeeManagementDeleteButtonPopup" + id}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div
      id="employmentsManagement-wrapper"
      className="h-full w-full rounded-lg  "
    >
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
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        className="border-0"
      />
    </div>
  );
}
