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
  EmployeeEmployedType,
  EmployeeType,
  RestaurantType,
} from "../../../services/types";
import { fetchDELETE, fetchGET } from "../../../services/APIconn";
import { Modal } from "@mui/material";
import EmployeeRegister from "../../register/EmployeeRegister";
import { Restaurant } from "@mui/icons-material";
import RestaurantAddEmp from "../restaurants/RestaurantAddEmp";
import { useTranslation } from "react-i18next";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

export default function EmployeeRestaurantManagement({
  activeRestaurantId,
}: {
  activeRestaurantId: string;
}) {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isEmploymentOpen, setIsEmploymentOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const { t } = useTranslation("global");

  useEffect(() => {
    const populateRows = async () => {
      try {
        console.log(activeRestaurantId);
        const response = await fetchGET(
          `/my-restaurants/${activeRestaurantId}/employees`,
        );

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
              employmentId: response[i].employmentId,
            });
          }
        console.log(employees);

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
        <div className="z-1 flex h-[3rem] w-full items-center">
          <button
            id="RestaurantListAddRestaurantButton"
            onClick={() => setIsModalOpen(true)}
            className="flex h-full items-center justify-center gap-2 rounded-lg p-2 text-primary hover:bg-grey-1"
          >
            <AddIcon />
            <h1 className="font-mont-md text-lg">{t('employees.add-employee')}</h1>
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
      headerName: t('employees.name'),
      type: "string",
      width: 180,
      editable: true,
    },
    {
      field: "lastName",
      headerName: t('employees.surname'),
      type: "string",
      width: 180,
      editable: true,
    },
    {
      field: "phoneNumber",
      headerName: t('employees.phone-number'),
      type: "string",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "isHallEmployee",
      headerName: t('employees.hall-role'),
      type: "boolean",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "isBackdoorEmployee",
      headerName: t('employees.backdoor-role'),
      type: "boolean",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "dateFrom",
      headerName: t('employees.assigned-since'),
      type: "string",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "dateUntil",
      headerName: t('employees.assigned-until'),
      type: "string",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: t('employees.actions'),
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label={t('general.save')}
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
              label={t('general.cancel')}
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Restaurant />}
            label={t('employees.employments')}
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
            label={t('general.edit')}
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
            label={t('general.delete')}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="h-full w-full rounded-lg bg-white ">
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
          <RestaurantAddEmp empid={selectedId} />
        </div>
      </Modal>
    </div>
  );
}
