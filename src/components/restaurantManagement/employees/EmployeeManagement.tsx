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
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
} from "@mui/x-data-grid";
import {
  EmployeeType,
  EmploymentType,
} from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { Modal } from "@mui/material";
import EmployeeRegister from "../../register/EmployeeRegister";
import { Restaurant } from "@mui/icons-material";
import RestaurantAddEmp from "../restaurants/RestaurantAddEmp";
import EmploymentsManagement from "./EmploymentsManagement";

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

  const [isEmploymentOpen, setIsEmploymentOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const populateRows = async () => {
      try {
        const response = await fetchGET("/user/employees");

        let employees: EmployeeType[] = [];

        if (response.length)
          for (const i in response) {
            const tmp: EmploymentType[] = [];
            for (const j in response[i].employments) {
              tmp.push({
                id: response[i].employments[j].employmentId,
                restaurantId: response[i].employments[j].restaurantId,
                isBackdoorEmployee:
                  response[i].employments[j].isBackdoorEmployee,
                isHallEmployee: response[i].employments[j].isHallEmployee,
                restaurantName: response[i].employments[j].restaurantName,
              });
            }
            employees.push({
              id: Number(i),
              empID: response[i].userId,
              login: response[i].login,
              firstName: response[i].firstName,
              lastName: response[i].lastName,
              phoneNumber: response[i].phoneNumber,
              employments: tmp.slice(),
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
        <div className="z-1 flex h-[3rem] w-full items-center p-1">
          <button
            id="RestaurantListAddRestaurantButton"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
          >
            <h1 className="font-mont-md text-md">+ Add an employee</h1>
          </button>
        </div>
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

  const handleEmploymentClick = (id: string) => () => {
    setIsEmploymentOpen(true);
    setSelectedId(id);
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
            icon={<Restaurant />}
            label="Employments"
            id={
              "EmployeeManagementEmploymentButton" +
              rows[parseInt(id.toString())].login
            }
            className="textPrimary"
            onClick={handleEmploymentClick(rows[parseInt(id.toString())].empID)}
            color="inherit"
          />,
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
    <div className="h-full w-full rounded-b-lg bg-white dark:bg-black rounded-tr-lg">
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
        className="border-0"
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
      <Modal
        open={isEmploymentOpen}
        onClose={() => setIsEmploymentOpen(false)}
        className="flex items-center justify-center"
      >
        <div className=" rounded-xl bg-white p-3">
          <h1 className="text-center" id="employeeManagement-modal-header">
            Employments
          </h1>

          <RestaurantAddEmp empid={selectedId} />
          <EmploymentsManagement empid={selectedId} />
        </div>
      </Modal>
    </div>
  );
}
