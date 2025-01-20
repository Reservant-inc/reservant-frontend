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
import { EmployeeType, EmploymentType } from '../../../../services/types'
import { fetchDELETE, fetchGET, fetchPUT } from '../../../../services/APIconn'
import EmployeeRegister from '../register/EmployeeRegister'
import { Add, Restaurant } from '@mui/icons-material'
import Dialog from '../../../reusableComponents/Dialog'
import EmploymentsManagement from './EmploymentsManagement'
import ConfirmationDialog from '../../../reusableComponents/ConfirmationDialog'
import { FetchError } from '../../../../services/Errors'
import { parsePhoneNumber } from 'libphonenumber-js'
import { useTranslation } from 'react-i18next'

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

export default function EmployeeManagement() {
  const [t] = useTranslation('global')
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEmploymentOpen, setIsEmploymentOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>('')
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
  const [empToDel, setEmpToDel] = useState<string>('')

  useEffect(() => {
    populateRows()
  }, [])

  const populateRows = async () => {
    try {
      const response = await fetchGET('/user/employees')

      let employees: EmployeeType[] = []

      if (response.length)
        for (const i in response) {
          if (
            response[i].firstName !== 'DELETED' &&
            response[i].lastName !== 'DELETED'
          ) {
            const tmp: EmploymentType[] = []
            for (const j in response[i].employments) {
              tmp.push({
                employmentId: response[i].employments[j].employmentId,
                restaurantId: response[i].employments[j].restaurantId,
                isBackdoorEmployee:
                  response[i].employments[j].isBackdoorEmployee,
                isHallEmployee: response[i].employments[j].isHallEmployee,
                restaurantName: response[i].employments[j].restaurantName
              })
            }
            employees.push({
              id: Number(i),
              userId: response[i].userId,
              login: response[i].login,
              firstName: response[i].firstName,
              lastName: response[i].lastName,
              birthDate: response[i].birthDate,
              phoneNumber:
                response[i].phoneNumber?.code + response[i].phoneNumber?.number,
              employments: tmp.slice()
            })
          }
        }
      for (const i in employees) {
        employees[i].id = Number(i)
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
            className="flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
          >
            <h1 className="font-mont-md text-md">+ {t('employee-management.add-employee')}</h1>
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

  const handleEmploymentClick = (id: string) => {
    setIsEmploymentOpen(true)
    setSelectedId(id)
  }

  const handleEditClick = async (id: GridRowId) => {
    setRowModesModel(prevModel => ({
      ...prevModel,
      [id]: { mode: GridRowModes.Edit }
    }))
  }

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel(prevModel => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View }
    }))
  }

  const handleDeleteClick = (id: GridRowId) => {
    const emp = rows.find(row => row.id == id)?.userId
    setEmpToDel(emp)
    setIsConfirmationOpen(true)
  }

  const handleDeleteEmp = async (id: string) => {
    if (id === null) return
    try {
      await fetchDELETE(`/user/${id}`)
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

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const putEmp = async (updatedRow: GridRowModel) => {
      try {
        const number = parsePhoneNumber(updatedRow.phoneNumber)

        const body = JSON.stringify({
          phoneNumber: {
            code: '+' + number.countryCallingCode,
            number: number.nationalNumber
          },
          firstName: updatedRow.firstName,
          lastName: updatedRow.lastName,
          birthDate: updatedRow.birthDate,
          photo: 'string'
        })

        await fetchPUT(`/users/${updatedRow.userId}`, body)

        populateRows()
      } catch (error) {
        if (error instanceof FetchError) {
          console.log(error.formatErrors())
        } else {
          console.log('Unexpected error')
        }
      }
    }

    const updatedRow = { ...newRow, isNew: false }
    setRows(prevRows =>
      prevRows.map(row => (row.id === newRow.id ? updatedRow : row))
    )

    putEmp(updatedRow)

    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef[] = [
    {
      field: 'userId',
      headerName: t('employee-management.userId'),
      type: 'string',
      width: 150,
      editable: false
    },
    {
      field: 'firstName',
      headerName: t('employee-management.firstName'),
      type: 'string',
      width: 180,
      editable: true
    },
    {
      field: 'lastName',
      headerName: t('employee-management.lastName'),
      type: 'string',
      width: 180,
      editable: true
    },
    {
      field: 'phoneNumber',
      headerName: t('employee-management.phoneNumber'),
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: true
    },
    {
      field: 'birthDate',
      headerName: t('employee-management.birthDate'),
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: true
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('employee-management.actions'),
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
              onClick={() => handleSaveClick(id)}
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

        return rows[parseInt(id.toString())].birthDate !== '0001-01-01'
          ? [
              <GridActionsCellItem
                icon={<Restaurant />}
                label="Employments"
                id={
                  'EmployeeManagementEmploymentButton' +
                  rows[parseInt(id.toString())].login
                }
                className="textPrimary"
                onClick={() =>
                  handleEmploymentClick(rows[parseInt(id.toString())].userId)
                }
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                id={
                  'EmployeeManagementEditButton' +
                  rows[parseInt(id.toString())].login
                }
                className="textPrimary"
                onClick={() => handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                id={
                  'EmployeeManagementDeleteButton' +
                  rows[parseInt(id.toString())].login
                }
                label="Delete"
                onClick={() => handleDeleteClick(id)}
                color="inherit"
              />
            ]
          : []
      }
    }
  ]

  return (
    <>
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
            pagination: { paginationModel: { pageSize: 5 } }
          }}
          pageSizeOptions={[5, 10, 25]}
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar']
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel }
          }}
          className="border-0"
        />
      </div>
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            populateRows()
          }}
          title={t('employee-management.creating-employee')}
        >
          <EmployeeRegister
            onClose={() => {
              setIsModalOpen(false)
              populateRows()
            }}
          />
        </Dialog>
      )}
      {isEmploymentOpen && (
        <Dialog
          open={isEmploymentOpen}
          onClose={() => setIsEmploymentOpen(false)}
          title="Employments"
        >
          <EmploymentsManagement empid={selectedId} />
        </Dialog>
      )}
      <ConfirmationDialog
        open={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteEmp(empToDel)
          populateRows()
        }}
        confirmationText={t('employee-management.delete-employee-confirmation')} //@TODO translation
      />
    </>
  )
}
