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
import { EmployeeEmployedType, EmployeeType } from '../../../../services/types'
import {
  fetchDELETE,
  fetchGET,
  fetchPOST,
  fetchPUT
} from '../../../../services/APIconn'
import EmployeeRegister from '../register/EmployeeRegister'
import Dialog from '../../../reusableComponents/Dialog'
import ConfirmationDialog from '../../../reusableComponents/ConfirmationDialog'
import { FetchError } from '../../../../services/Errors'
import { ErrorMessage, Field, Form, Formik, FormikValues } from 'formik'
import { useValidationSchemas } from '../../../../hooks/useValidationSchema'
import ErrorMes from '../../../reusableComponents/ErrorMessage'
import { useTranslation } from 'react-i18next'

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

const initialValues = {
  selectedEmp: '',
  isBackdoorEmployee: '',
  isHallEmployee: ''
}

export default function EmployeeRestaurantManagement() {
  const [t] = useTranslation('global')

  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
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
            phoneNumber:
              response[i].phoneNumber.code + response[i].phoneNumber.number,
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
  const { RestaurantAddEmployeeSchema2 } = useValidationSchemas()
  const [employees, setEmployees] = useState<EmployeeType[]>([])

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await fetchGET('/user/employees')

        let tmp: EmployeeType[] = res

        setEmployees(tmp)
      } catch (error) {
        console.error('Error fetching restaurants', error)
      }
    }
    getEmployees()
  }, [])
  const EditToolbar = (props: EditToolbarProps) => {
    return (
      <GridToolbarContainer>
        <div className="z-1 flex gap-2 h-[3rem] w-full items-center p-1">
          <button
            id="RestaurantEmpCreate"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            <h1 className="text-md font-mont-md">
              + {t('employee-management.add-employee')}
            </h1>
          </button>
          <button
            id="RestaurantEmpAdd"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            <h1 className="text-md font-mont-md">
              + {t('employee-management.assign-employee')}
            </h1>
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
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error')
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

  const handleSubmit = async (values: FormikValues) => {
    try {
      const body = JSON.stringify([
        {
          employeeId: values.selectedEmp,
          isHallEmployee:
            values.isHallEmployee === '' ? false : values.isHallEmployee,
          isBackdoorEmployee:
            values.isBackdoorEmployee === '' ? false : values.isBackdoorEmployee
        }
      ])
      await fetchPOST(`/my-restaurants/${restaurantId}/employees`, body)

      populateRows()

      let selector: HTMLSelectElement = document.getElementById(
        'selectedRestaurant'
      ) as HTMLSelectElement
      selector.selectedIndex = 0
    } catch (error) {
      console.error(error)
    }
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef[] = [
    {
      field: 'empID',
      headerName: t('employee-management.userId'),
      type: 'string',
      flex: 1,
      editable: false
    },
    {
      field: 'firstName',
      headerName: t('employee-management.firstName'),
      type: 'string',
      flex: 0.5,
      editable: false
    },

    {
      field: 'lastName',
      headerName: t('employee-management.lastName'),
      type: 'string',
      flex: 0.5,
      editable: false
    },
    {
      field: 'phoneNumber',
      headerName: t('employee-management.phoneNumber'),
      type: 'string',
      flex: 0.5,
      editable: false
    },
    {
      field: 'isHallEmployee',
      headerName: t('employee-management.hallRole'),
      type: 'boolean',
      flex: 0.5,
      editable: true
    },
    {
      field: 'isBackdoorEmployee',
      headerName: t('employee-management.backdoorRole'),
      type: 'boolean',
      flex: 0.5,
      editable: true
    },
    {
      field: 'dateFrom',
      headerName: t('employee-management.assignedSince'),
      type: 'string',
      flex: 1,
      editable: false
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: t('employee-management.actions'),
      flex: 0.5,
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
      {isCreateModalOpen && (
        <Dialog
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={t('employee-management.creating-employee')}
        >
          <EmployeeRegister
            onClose={() => {
              setIsCreateModalOpen(false)
            }}
          />
        </Dialog>
      )}
      {isAddModalOpen && (
        <Dialog
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={t('employee-management.adding-employment')}
        >
          <div className="p-2 w-[500px] items-center justify-center flex">
            <Formik
              initialValues={initialValues}
              validationSchema={RestaurantAddEmployeeSchema2}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values)
                resetForm()
              }}
            >
              {formik => {
                return (
                  <Form>
                    <div className="w-full flex flex-col items-center gap-3 justify-center">
                      <div className="form-control flex gap-6 w-full justify-start">
                        <Field
                          id="selectedEmp"
                          default="Select an employee"
                          className="dark:bg-black text-ellipsis overflow-hidden w-1/2 pr-8 dark:text-grey-0 rounded-lg"
                          name="selectedEmp"
                          component="select"
                        >
                          <option
                            value=""
                            disabled={true}
                            selected={true}
                            id="addEmp-option-default"
                          >
                            Employee
                          </option>
                          {employees
                            .filter(
                              emp => !rows.find(row => row.empID === emp.userId)
                            )
                            .map(emp => (
                              <option value={emp.userId}>
                                {' '}
                                {emp.firstName} {emp.lastName}
                              </option>
                            ))}
                        </Field>
                        <div className="flex flex-col">
                          <span className="flex items-center gap-2">
                            <Field
                              type="checkbox"
                              id="isBackdoorEmployee"
                              name="isBackdoorEmployee"
                              checked={formik.values.isBackdoorEmployee}
                              className={` text-nowrap border-[1px] hover:cursor-pointer ${(formik.errors.isHallEmployee || formik.errors.isBackdoorEmployee) && (formik.touched.isHallEmployee || formik.touched.isBackdoorEmployee) ? 'border-error' : 'border-black dark:border-grey-0'}`}
                            />
                            <label
                              htmlFor="isBackdoorEmployee"
                              className={`${(formik.errors.isHallEmployee || formik.errors.isBackdoorEmployee) && (formik.touched.isHallEmployee || formik.touched.isBackdoorEmployee) ? 'text-error' : 'dark:text-grey-0 text-black'}`}
                            >
                              {t('add-employee.isBackdoorEmployee')}
                            </label>
                          </span>
                          <span className="flex items-center gap-2">
                            <Field
                              type="checkbox"
                              id="isHallEmployee"
                              name="isHallEmployee"
                              checked={formik.values.isHallEmployee}
                              className={`  text-nowrap   border-[1px] hover:cursor-pointer ${(formik.errors.isHallEmployee || formik.errors.isBackdoorEmployee) && (formik.touched.isHallEmployee || formik.touched.isBackdoorEmployee) ? 'border-error' : 'border-black dark:border-grey-0'}`}
                            />
                            <label
                              htmlFor="isHallEmployee"
                              className={`${(formik.errors.isHallEmployee || formik.errors.isBackdoorEmployee) && (formik.touched.isHallEmployee || formik.touched.isBackdoorEmployee) ? 'text-error' : 'dark:text-grey-0 text-black'}`}
                            >
                              {t('add-employee.isHallEmployee')}
                            </label>
                          </span>
                        </div>
                      </div>
                      <button
                        id="RestaurantAddEmpSubmitButton"
                        type="submit"
                        disabled={!formik.dirty || !formik.isValid}
                        className=" gap-1 flex items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary enabled:dark:hover:bg-secondary enabled:hover:bg-primary enabled:hover:text-white enabled:dark:hover:text-black"
                      >
                        <h1 className="font-mont-md text-md text-nowrap">
                          {t('add-employee.addEmployee')}
                        </h1>
                      </button>
                      <div className="">
                        <ErrorMessage name="isBackdoorEmployee">
                          {msg => <ErrorMes msg={msg} />}
                        </ErrorMessage>
                        {!formik.touched.isBackdoorEmployee && (
                          <ErrorMessage name="isHallEmployee">
                            {msg => <ErrorMes msg={msg} />}
                          </ErrorMessage>
                        )}
                      </div>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </Dialog>
      )}
      <ConfirmationDialog
        open={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteEmp(empToDel)
          populateRows()
        }}
        confirmationText={t('employee-management.unassign')}
      />
    </div>
  )
}
