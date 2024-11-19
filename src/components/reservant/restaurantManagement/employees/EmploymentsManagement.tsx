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
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons
} from '@mui/x-data-grid'
import { EmploymentType, RestaurantShortType } from '../../../../services/types'
import {
  fetchDELETE,
  fetchGET,
  fetchPOST,
  fetchPUT
} from '../../../../services/APIconn'
import { Add } from '@mui/icons-material'
import { FormikValues, Formik, ErrorMessage, Field, Form } from 'formik'
import { useTranslation } from 'react-i18next'
import { useValidationSchemas } from '../../../../hooks/useValidationSchema'
import ErrorMes from '../../../reusableComponents/ErrorMessage'

const initialValues = {
  selectedRestaurant: '',
  isBackdoorEmployee: '',
  isHallEmployee: ''
}

export default function EmploymentsManagement({ empid }: { empid: string }) {
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  useEffect(() => {
    populateRows()
  }, [])

  const populateRows = async () => {
    try {
      const response = await fetchGET('/user/employees')
      const tmp: EmploymentType[] = []

      if (response.length)
        for (const i in response) {
          if (response[i].userId === empid)
            for (const j in response[i].employments) {
              tmp.push({
                id: response[i].employments[j].employmentId,
                restaurantName: response[i].employments[j].restaurantName,
                restaurantId:
                  response[i].employments[j].restaurant.restaurantId,
                isBackdoorEmployee:
                  response[i].employments[j].isBackdoorEmployee,
                isHallEmployee: response[i].employments[j].isHallEmployee
              })
            }
        }

      setRows(tmp)
    } catch (error) {
      console.error('Error populating table', error)
    }
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleDeleteClick = (id: GridRowId) => async () => {
    setRows(rows.filter(row => row.id !== id))

    await fetchDELETE(`/employments/${id}`)
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

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const processRowUpdate = async (newRow: GridRowModel) => {
    if (!(newRow.isHallEmployee || newRow.isBackdoorEmployee)) return
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map(row => (row.id === newRow.id ? updatedRow : row)))
    const body = JSON.stringify([
      {
        employmentId: newRow.id,
        isBackdoorEmployee: newRow.isBackdoorEmployee,
        isHallEmployee: newRow.isHallEmployee
      }
    ])
    await fetchPUT('/employments', body)
    return updatedRow
  }

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const columns: GridColDef[] = [
    {
      field: 'restaurantName',
      headerName: 'Restaurant',
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
      editable: true
    },
    {
      field: 'isBackdoorEmployee',
      headerName: 'Backdoor role',
      type: 'boolean',
      width: 180,
      editable: true
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
              id={'EmployeeManagementSaveButtonPopup' + id}
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              id={'EmployeeManagementCancelEditButtonPopup' + id}
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
            id={'EmployeeManagementEditButtonPopup' + id}
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            id={'EmployeeManagementDeleteButtonPopup' + id}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ]
      }
    }
  ]
  const [t] = useTranslation('global')
  const { RestaurantAddEmployeeSchema } = useValidationSchemas()
  const [restaurants, setRestaurants] = useState<RestaurantShortType[]>([])

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await fetchGET('/user/employees')
        const tmp: EmploymentType[] = []

        if (response.length)
          for (const i in response) {
            if (response[i].userId === empid)
              for (const j in response[i].employments) {
                tmp.push({
                  id: response[i].employments[j].employmentId,
                  restaurantName: response[i].employments[j].restaurantName,
                  restaurantId: response[i].employments[j].restaurantId,
                  isBackdoorEmployee:
                    response[i].employments[j].isBackdoorEmployee,
                  isHallEmployee: response[i].employments[j].isHallEmployee
                })
              }
          }
        const response1 = await fetchGET('/my-restaurants')
        let tmp1: RestaurantShortType[] = []

        for (const restaurant of response1) {
          tmp1.push({
            restaurantId: restaurant.restaurantId,
            name: restaurant.name
          })
        }

        tmp1 = tmp1.filter(e => {
          for (const i in tmp) {
            if (e.restaurantId === tmp[i].restaurantId) return false
          }
          return true
        })
        setRestaurants(tmp1)
      } catch (error) {
        console.error('Error fetching restaurants', error)
      }
    }
    getRestaurants()
  }, [])

  const handleSubmit = async (values: FormikValues) => {
    try {
      const body = JSON.stringify([
        {
          employeeId: empid,
          isHallEmployee:
            values.isHallEmployee === '' ? false : values.isHallEmployee,
          isBackdoorEmployee:
            values.isBackdoorEmployee === '' ? false : values.isBackdoorEmployee
        }
      ])

      await fetchPOST(
        `/my-restaurants/${values.selectedRestaurant}/employees`,
        body
      )

      populateRows()

      let selector: HTMLSelectElement = document.getElementById(
        'selectedRestaurant'
      ) as HTMLSelectElement
      selector.selectedIndex = 0
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=" h-[50vh] flex flex-col w-fit ">
      <div className="p-3 h-[25%]">
        <Formik
          initialValues={initialValues}
          validationSchema={RestaurantAddEmployeeSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values)
            resetForm()
          }}
        >
          {formik => {
            return (
              <Form>
                <div className="w-full flex flex-col items-start gap-3 justify-center">
                  <div className="form-control flex gap-6 w-full justify-start">
                    <Field
                      id="selectedRestaurant"
                      default="Select a restaurant"
                      className="dark:bg-black dark:text-grey-0 rounded-lg"
                      name="selectedRestaurant"
                      component="select"
                    >
                      <option
                        value=""
                        disabled={true}
                        selected={true}
                        id="addEmp-option-default"
                      >
                        Restaurant
                      </option>
                      {restaurants
                        .filter(
                          restaurant =>
                            !rows.find(
                              row =>
                                row.restaurantId === restaurant.restaurantId
                            )
                        )
                        .map(restaurant => (
                          <option value={restaurant.restaurantId}>
                            {' '}
                            {restaurant.name}{' '}
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
                          className={`border-[1px] hover:cursor-pointer ${(formik.errors.isHallEmployee || formik.errors.isBackdoorEmployee) && (formik.touched.isHallEmployee || formik.touched.isBackdoorEmployee) ? 'border-error' : 'border-black dark:border-grey-0'}`}
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
                          className={`border-[1px] hover:cursor-pointer ${(formik.errors.isHallEmployee || formik.errors.isBackdoorEmployee) && (formik.touched.isHallEmployee || formik.touched.isBackdoorEmployee) ? 'border-error' : 'border-black dark:border-grey-0'}`}
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
                    <Add />
                    <h1 className="font-mont-md text-md">
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
      <div className="h-[75%]">
        <div
          id="restaurantAddEmp-container-register"
          className="dark:text-grey-0 p-3 h-full"
        >
          <div
            id="employmentsManagement-wrapper"
            className="h-full w-full rounded-lg  "
          >
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
              slotProps={{
                toolbar: { setRows, setRowModesModel }
              }}
              className="border-0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
