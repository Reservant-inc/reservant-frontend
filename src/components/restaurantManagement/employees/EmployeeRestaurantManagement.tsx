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
import { EmployeeEmployedType, EmployeeType, RestaurantType } from "../../../services/types";
import { fetchDELETE, fetchGET } from "../../../services/APIconn";
import { Modal } from "@mui/material";
import EmployeeRegister from "../../register/EmployeeRegister";
import { Restaurant } from "@mui/icons-material";
import RestaurantAddEmp from "../restaurants/RestaurantAddEmp";
import { EditEmployeeToolbarProps } from "../../../services/interfaces/restaurant"


export default function EmployeeRestaurantManagement({activeRestaurantId}:{activeRestaurantId: string}) {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [isEmploymentOpen, setIsEmploymentOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const populateRows = async () => {
      try {
        console.log(activeRestaurantId)
        const response = await fetchGET(`/my-restaurants/${activeRestaurantId}/employees`);

        let employees: EmployeeEmployedType[] = [];

        if (response.length)
        for (const i in response) {
            employees.push({
            id: Number(i),
            empID: response[i].employeeId,
            login: response[i].login,
            firstName: response[i].firstName,
            lastName: response[i].lastName,
            phoneNumber: response[i].phoneNumber,
            isBackdoorEmployee: response[i].isBackdoorEmployee,
            isHallEmployee: response[i].isHallEmployee,
            dateFrom: response[i].dateFrom,
            dateUntil: response[i].dateUntil,
            employmentId: response[i].employmentId
            });
        }
        console.log(employees)
        
        setRows(employees);
          
          
        
      } catch (error) {
        console.error("Error populating table", error);
      }
    };
    
    populateRows();

    
  }, []);

  

  const EditToolbar = (props: EditEmployeeToolbarProps) => {
    return (
      <GridToolbarContainer>
        <div className="h-[3rem] w-full z-1 flex items-center">
                <button
                    id="RestaurantListAddRestaurantButton"
                    onClick={() => setIsModalOpen(true)}
                    className="h-full rounded-lg text-primary justify-center items-center flex gap-2 hover:bg-grey-1 p-2"
                >
                    <AddIcon />
                    <h1 className="text-lg font-mont-md">Add employee</h1>
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
        field: "isHallEmployee",
        headerName: "Hall role",
        type: "boolean",
        width: 180,
        align: "left",
        headerAlign: "left",
        editable: false,
      },
    {
        field: "isBackdoorEmployee",
        headerName: "Backdoor role",
        type: "boolean",
        width: 180,
        align: "left",
        headerAlign: "left",
        editable: false,
      },
    {
        field: "dateFrom",
        headerName: "Assigned since",
        type: "string",
        width: 180,
        align: "left",
        headerAlign: "left",
        editable: false,
    },
    {
        field: "dateUntil",
        headerName: "Assigned until",
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
    <div className="h-full w-full bg-white rounded-lg ">
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
        <div className="h-[500px] w-[500px] rounded-xl bg-white p-3">
          <RestaurantAddEmp  empid={selectedId}/>
        </div>
      </Modal>
    </div>
  );
}
