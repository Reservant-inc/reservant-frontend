import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
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
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
  gridRowsDataRowIdToIdLookupSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import { EmployeeType } from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { Modal } from "@mui/material";
import EmployeeRegister from "../../register/EmployeeRegister";
import { number } from "yup";
import { getRowIdFromRowModel } from "@mui/x-data-grid/internals";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

export default function EmployeeManagement() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const populateRows = async () => {
      try {
        const response = await fetchGET("/user/employees");

        const employees: EmployeeType[] = [];

        const getRole = (employment: {
          isBackdoorEmployee: boolean;
          isHallEmployee: boolean;
        }): string => {
          return employment.isBackdoorEmployee
            ? employment.isHallEmployee
              ? "Hall and Backdoor"
              : "Backdoor"
            : employment.isHallEmployee
              ? "Hall"
              : "None";
        };

        if (response.length)
          for (const i in response) {
            employees.push({
              id: Number(i),
              empID: response[i].userId,
              login: response[i].login,
              firstName: response[i].firstName,
              lastName: response[i].lastName,
              phoneNumber: response[i].phoneNumber,
              role: "asd",
              // getRole(response[i]?.employments[0]),
              restaurant: "asd",
            });
          }

        setRows(employees);
      } catch (error) {
        console.error("Error populating table", error);
      }
    };
    populateRows();
  }, []);

  const EditToolbar = (props: EditToolbarProps) => {
    return (
      <GridToolbarContainer>
        <Button
          color="primary"
          id="EmployeeManagementAddEmployeeButton"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Employee
        </Button>
      </GridToolbarContainer>
    );
  };
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

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows?.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: "empID", headerName: "ID", width: 180, editable: false },
    {
      field: "login",
      headerName: "Login",
      type: "string",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "firstName",
      headerName: "Name",
      type: "string",
      width: 180,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Surname",
      type: "string",
      width: 180,
      editable: true,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      type: "string",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 180,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Hall", "Backdoor", "Hall and Backdoor", "None"],
    },
    {
      field: "restaurant",
      headerName: "Restaurant",
      width: 180,
      editable: true,
      type: "singleSelect",
      valueOptions: [],
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
              id={
                "EmployeeManagementSaveButton" +
                rows[parseInt(id.toString())].login
              }
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              id={
                "EmployeeManagementCancelEditButton" +
                rows[parseInt(id.toString())].login
              }
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
            id={
              "EmployeeManagementEditButton" +
              rows[parseInt(id.toString())].login
            }
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            id={
              "EmployeeManagementDeleteButton" +
              rows[parseInt(id.toString())].login
            }
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="h-full">
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
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="flex items-center justify-center"
      >
        <div className="h-[500px] w-[500px] rounded-xl bg-white p-3">
          <EmployeeRegister setIsModalOpen={setIsModalOpen} />
        </div>
      </Modal>
    </div>
  );
}
