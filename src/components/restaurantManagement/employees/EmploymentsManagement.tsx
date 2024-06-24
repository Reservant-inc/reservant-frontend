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
import { EmployeeEmployedType, EmployeeType, EmploymentType, RestaurantType } from "../../../services/types";
import { fetchDELETE, fetchGET, fetchPUT } from "../../../services/APIconn";
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

export default function EmploymentsManagement({empid}:{empid:string}) {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [isEmploymentOpen, setIsEmploymentOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const populateRows = async () => {
        try {
      
          const response = await fetchGET("/user/employees");
          const tmp: EmploymentType[] = [];
          
          if (response.length)
            for (const i in response) {
                console.log("KURWAAAAAAAAAAAAAAAAAAAAAAAA" + empid)
              if(response[i].userId===empid)
              for (const j in response[i].employments){
                tmp.push({
                  id: response[i].employments[j].employmentId,
                  restaurantName: response[i].employments[j].restaurantName,
                  restaurantId: response[i].employments[j].restaurantId,
                  isBackdoorEmployee: response[i].employments[j].isBackdoorEmployee,
                  isHallEmployee: response[i].employments[j].isHallEmployee,
                })
              }
        }
        console.log(tmp)
        
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

  const handleEmploymentClick = (id: string) => () => {
    setIsEmploymentOpen(true);
    setSelectedId(id);
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    const body =JSON.stringify({
      employmentId: id,
      isHallEmployee: rows.find((row)=>row.id===id)?.isHallEmployee,
      isBackdoorEmployee: rows.find((row)=>row.id===id)?.isBackdoorEmployee
    })
    console.log(body)
    await fetchPUT("/employments", body)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    setRows(rows.filter((row) => row.id !== id));

    await fetchDELETE(`/employments/${id}`)
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
    { field: "id", headerName: "ID", width: 180, editable: false },
    {
      field: "restaurantName",
      headerName: "restaurantName",
      type: "string",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "isHallEmployee",
      headerName: "isHallEmployee",
      type: "boolean",
      width: 180,
      editable: true,
    },
    {
      field: "isBackdoorEmployee",
      headerName: "isBackdoorEmployee",
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
              id={
                "EmployeeManagementSaveButtonPopup" +
                id
              }
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              id={
                "EmployeeManagementCancelEditButtonPopup" +
                id
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
              "EmployeeManagementEditButtonPopup" +
              id
            }
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            id={
              "EmployeeManagementDeleteButtonPopup" +
              id
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
    <div id="employmentsManagement-wrapper" className="h-full w-full bg-white rounded-lg ">
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
