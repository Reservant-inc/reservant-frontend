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
import { EmployeeType, RestaurantType } from "../../../services/types";
import { fetchGET } from "../../../services/APIconn";
import { Modal } from "@mui/material";
import EmployeeRegister from "../../register/EmployeeRegister";
import { Restaurant } from "@mui/icons-material";
import RestaurantAddEmp from "../restaurants/RestaurantAddEmp";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

export default function EmployeeManagement({restaurantFilter}:{restaurantFilter: string}) {
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
            employees.push({
              id: Number(i),
              empID: response[i].userId,
              login: response[i].login,
              firstName: response[i].firstName,
              lastName: response[i].lastName,
              phoneNumber: response[i].phoneNumber,
              restaurantId: response[i].employments.restaurantId,
              isBackdoorEmployee: response[i].employments.isBackdoorEmployee,
              isHallEmployee: response[i].employments.isHallEmployee,
              restaurantName: response[i].employments.restaurantName
               
            });
          }
        console.log(employees)
        employees = employees.filter((employee: EmployeeType) => {
          return employee.restaurantName!==undefined ? 
                  employee.restaurantName.toLowerCase().includes(restaurantFilter) : 
                  restaurantFilter!==""?
                    false:
                    true;
        });
          
        setRows(employees);
      } catch (error) {
        console.error("Error populating table", error);
      }
    };
    populateRows();
    
    
  }, []);

  const getRestaurants = async (id:string) => {
    try {

      const response = await fetchGET("/my-restaurant-groups");
      const tmp: string[] = [];

      for (const group of response) {
      
      const response2 = await fetchGET(`/my-restaurant-groups/${group.restaurantGroupId}`);

          console.log(response2)

          for (const i in response2.restaurants) {
              tmp.push(
                response2.restaurants[i].name
              );
          }
      }
      console.log(tmp)

    } catch (error) {
      console.error("Error fetching restaurants", error);
    }
  }

  const EditToolbar = (props: EditToolbarProps) => {
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
          <RestaurantAddEmp setIsModalOpen={setIsEmploymentOpen} id={selectedId}/>
        </div>
      </Modal>
    </div>
  );
}
