import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
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
  GridSlots
} from '@mui/x-data-grid'
import { useParams } from 'react-router-dom'
import { EmployeeEmployedType } from '../../../../services/types'
import { fetchDELETE, fetchGET, fetchPUT } from '../../../../services/APIconn'
import EmployeeRegister from '../register/EmployeeRegister'
import Dialog from '../../../reusableComponents/Dialog'
import AddIcon from '@mui/icons-material/Add'
import ConfirmationDialog from '../../../reusableComponents/ConfirmationDialog'
import { FetchError } from '../../../../services/Errors'

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

export default function EmployeeRestaurantManagement() {
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
  const [empToDel, setEmpToDel] = useState<string>('')

  const { restaurantId } = useParams()

  const activeRestaurantId =
    restaurantId === undefined ? -1 : parseInt(restaurantId)

  useEffect(() => {
    populateRows()
  }, [])
  const populateRows = async () => {
    try {
      const response = await fetchGET(
        `/my-restaurants/${activeRestaurantId}/employees`
      )

      let employees: EmployeeEmployedType[] = []

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
          })
        }

      setRows(employees)
    } catch (error) {
      console.error('Error populating table', error)
    }
  }
  const EditToolbar = (props: EditToolbarProps) => {
    return (
      <GridToolbarContainer>
        <div className="z-1 flex h-[3rem] w-full items-center p-1">
          <button
            id="RestaurantListAddRestaurantButton"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            <h1 className="text-md font-mont-md">+ Add an employee</h1>
          </button>
        </div>
      </GridToolbarContainer>
    )
  }
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleDeleteEmp = async (id: string) => {
    if (id === null) return
    try {
      await fetchDELETE(`/employments/${id}`)
      setEmpToDel('')
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error')
      }
    }
    populateRows()
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    const emp = rows.find(row => row.id == id)?.employmentId
    setEmpToDel(emp)
    setIsConfirmationOpen(true)
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })

    const editedRow = rows.find(row => row.id === id)
    if (editedRow!.isNew) {
      setRows(rows.filter(row => row.id !== id))
    }
  }

  const processRowUpdate = async (newRow: GridRowModel) => {
    if (!(newRow.isHallEmployee || newRow.isBackdoorEmployee)) return
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map(row => (row.id === newRow.id ? updatedRow : row)))
    const body = JSON.stringify([
      {
        employmentId: newRow.employmentId,
        isBackdoorEmployee: newRow.isBackdoorEmployee,
        isHallEmployee: newRow.isHallEmployee
      }
    ])
    await fetchPUT('/employments', body)
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First name',
      type: 'string',
      width: 180,
      editable: false
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      type: 'string',
      width: 180,
      editable: false
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone number',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: false
    },
    {
      field: 'isHallEmployee',
      headerName: 'Hall role',
      type: 'boolean',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: true
    },
    {
      field: 'isBackdoorEmployee',
      headerName: 'Backdoor role',
      type: 'boolean',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: true
    },
    {
      field: 'dateFrom',
      headerName: 'Assigned since',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: false
    },
    {
      field: 'dateUntil',
      headerName: 'Assigned until',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              id={
                'EmployeeManagementSaveButton' +
                rows[parseInt(id.toString())].login
              }
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              id={
                'EmployeeManagementCancelEditButton' +
                rows[parseInt(id.toString())].login
              }
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            id={
              'EmployeeManagementEditButton' +
              rows[parseInt(id.toString())].login
            }
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            id={
              'EmployeeManagementDeleteButton' +
              rows[parseInt(id.toString())].login
            }
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ]
      }
    }
  ]

  return (
    <div className="h-full w-full rounded-lg bg-white dark:bg-black">
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
          pagination: { paginationModel: { pageSize: 5 } }
        }}
        pageSizeOptions={[5, 10, 25]}
        slots={{
          toolbar: EditToolbar as GridSlots['toolbar']
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel }
        }}
        className="scroll border-0"
      />
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Creating a new employee..."
        >
          <EmployeeRegister setIsModalOpen={setIsModalOpen} />
        </Dialog>
      )}
      <ConfirmationDialog
        open={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteEmp(empToDel)
          populateRows()
        }}
        confirmationText={`Are you sure you want to delete this employment?`} //@TODO translation
      />
    </div>
  )
}