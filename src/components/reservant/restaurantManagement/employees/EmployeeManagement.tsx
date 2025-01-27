import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import {
  GridRowsProp,
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowId,
  GridSlots
} from '@mui/x-data-grid'
import {
  EmployeeType,
  EmploymentType,
  UserType
} from '../../../../services/types'
import { fetchDELETE, fetchGET, fetchPUT } from '../../../../services/APIconn'
import EmployeeRegister from '../register/EmployeeRegister'
import { Restaurant } from '@mui/icons-material'
import Dialog from '../../../reusableComponents/Dialog'
import EmploymentsManagement from './EmploymentsManagement'
import ConfirmationDialog from '../../../reusableComponents/ConfirmationDialog'
import { FetchError } from '../../../../services/Errors'
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
  const [empToEdit, setEmpToEdit] = useState<UserType | undefined>()

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
            <h1 className="font-mont-md text-md">
              + {t('employee-management.add-employee')}
            </h1>
          </button>
        </div>
      </GridToolbarContainer>
    )
  }

  const handleEmploymentClick = (id: string) => {
    setIsEmploymentOpen(true)
    setSelectedId(id)
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
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error')
      }
    }
    populateRows()
  }

  const handleRowEdit = async (id: GridRowId) => {
    const empId = rows.find(row => row.id == id)?.userId
    const empInfo = await fetchGET(`/users/${empId}`)
    setEmpToEdit(empInfo)
    setIsModalOpen(true)
  }

  const columns: GridColDef[] = [
    {
      field: 'userId',
      headerName: t('employee-management.userId'),
      type: 'string',
      flex: 1,
      editable: false
    },
    {
      field: 'firstName',
      headerName: t('employee-management.firstName'),
      type: 'string',
      flex: 1,
      editable: false
    },
    {
      field: 'lastName',
      headerName: t('employee-management.lastName'),
      type: 'string',
      flex: 1,
      editable: false
    },
    {
      field: 'phoneNumber',
      headerName: t('employee-management.phoneNumber'),
      type: 'string',
      flex: 1,
      editable: false
    },
    {
      field: 'birthDate',
      headerName: t('employee-management.birthDate'),
      type: 'string',
      flex: 1,
      editable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('employee-management.actions'),
      flex: 1,
      cellClassName: 'actions',
      getActions: ({ id }) => {
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
                onClick={() => {
                  handleRowEdit(id)
                }}
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
          rowModesModel={rowModesModel}
          disableRowSelectionOnClick
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
            setEmpToEdit(undefined)
          }}
          title={
            empToEdit === undefined
              ? t('employee-management.creating-employee')
              : t('employee-management.editing-employee')
          }
        >
          <EmployeeRegister
            emp={empToEdit}
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
          title={t('management-tabs.employments')}
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
