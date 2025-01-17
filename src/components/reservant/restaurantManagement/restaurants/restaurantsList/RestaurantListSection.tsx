import React, { useEffect, useState } from 'react'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  createTheme,
  ThemeProvider
} from '@mui/material'
import {
  GridToolbarContainer,
  GridRowModesModel,
  GridColDef,
  GridRowsProp,
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  GridRowModes,
  GridToolbarProps
} from '@mui/x-data-grid'
import {
  ArrowForwardIos,
  Close,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  fetchGET,
  fetchDELETE,
  fetchPUT,
  fetchPOST
} from '../../../../../services/APIconn'
import { LocalType } from '../../../../../services/enums'
import { GroupType, RestaurantType } from '../../../../../services/types'
import ConfirmationDialog from '../../../../reusableComponents/ConfirmationDialog'
import RegisterSuccess from '../../register/restaurantRegister/RegisterSuccess'
import RestaurantRegister from '../../register/restaurantRegister/RestaurantRegister'
import RestaurantDetails from '../RestaurantDetails'

const RestaurantListSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [registerSucces, setRegisterSucces] = useState<boolean>(false)
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
  const [restaurantToDelete, setRestaurantToDelete] = useState<string>('')
  const [groups, setGroups] = useState<GroupType[]>([])
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantType | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false)
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true)

  const navigate = useNavigate()
  const populateRows = async () => {
    try {
      const response = await fetchGET('/my-restaurant-groups')
      setGroups(response)
      const tmp: RestaurantType[] = []
      let indx = 0
      for (const group of response) {
        const response2 = await fetchGET(
          `/my-restaurant-groups/${group.restaurantGroupId}`
        )

        for (const i in response2.restaurants) {
          const response3 = await fetchGET(
            `/my-restaurants/${response2.restaurants[i].restaurantId}`
          )

          if (response3.isArchived) {
            continue
          }
          tmp.push({
            id: Number(indx++),
            groupId: group.restaurantGroupId,
            groupName: group.name,
            restaurantId: response3.restaurantId,
            name: response3.name,
            restaurantType: response3.restaurantType as LocalType,
            address: response3.address,
            city: response3.city,
            isVerified: response3.isVerified,
            reservationDeposit: response3.reservationDeposit,
            maxReservationDurationMinutes:
              response3.maxReservationDurationMinutes,
            tags: response3.tags,
            provideDelivery: response3.provideDelivery,
            logo: response3.logo,
            description: response3.description,
            location: response3.location,
            openingHours: response3.openingHours,
            nip: response3.nip,
            idCard: response3.idCard,
            photos: response3.photos,
            postalIndex: response3.postalIndex,
            businessPermission: response3.businessPermission,
            rentalContract: response3.rentalContract,
            alcoholLicense: response3.alcoholLicense,
            tables: response3.tables
          })
        }
      }
      setRows(tmp)
    } catch (error) {
      console.error('Error populating table', error)
    }
  }

  useEffect(() => {
    populateRows()
  }, [])

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel(prevModel => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View } // Using GridRowModes.View
    }))
  }

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel(prevModel => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true } // Using GridRowModes.View
    }))
  }

  const handleDeleteClick = (id: GridRowId) => {
    const restaurantId = rows.find(row => row.id === id)?.restaurantId
    if (restaurantId) {
      setRestaurantToDelete(restaurantId)
      setIsConfirmationOpen(true)
    }
  }

  const handleDeleteRestaurant = async (restaurantId: string) => {
    try {
      const response = await fetchDELETE(`/my-restaurants/${restaurantId}`)
      setRestaurantToDelete('')
      setIsConfirmationOpen(false)
      console.log(response)
      populateRows() // Refetch the data after deletion
    } catch (error) {
      console.error('Error deleting restaurant', error)
    }
  }

  const processRowUpdate = async (newRow: any) => {
    try {
      const { id, groupId, groupName, ...rowToUpdate } = newRow

      // Find the group associated with the current groupName
      const newGroup = groups.find(group => group.name === groupName)

      if (newGroup && newGroup.restaurantGroupId !== groupId) {
        // If groupId has changed, move the restaurant
        await fetchPOST(
          `/my-restaurants/${rowToUpdate.restaurantId}/move-to-group`,
          JSON.stringify({ groupId: newGroup.restaurantGroupId })
        )
      }

      // Usuwanie przedrostka '/uploads/' z wybranych pól, jeśli istnieją
      const fieldsToClean = [
        'businessPermission',
        'rentalContract',
        'alcoholLicense',
        'logo',
        'idCard'
      ]
      fieldsToClean.forEach(field => {
        if (rowToUpdate[field]?.startsWith('/uploads/')) {
          rowToUpdate[field] = rowToUpdate[field].replace('/uploads/', '')
        }
      })

      // Usuwanie przedrostka '/uploads/' z elementów tablicy photos, jeśli istnieją
      if (Array.isArray(rowToUpdate.photos)) {
        rowToUpdate.photos = rowToUpdate.photos.map((photo: string) =>
          photo.startsWith('/uploads/') ? photo.replace('/uploads/', '') : photo
        )
      }

      console.log('Dane wysyłane do API:', rowToUpdate)

      await fetchPUT(
        `/my-restaurants/${newRow.restaurantId}`,
        JSON.stringify(rowToUpdate)
      )
      populateRows()
      return newRow
    } catch (error) {
      console.error('Error updating restaurant:', error)
      throw error
    }
  }

  const EditToolbar: React.FC<
    GridToolbarProps & { onAddClick: () => void }
  > = ({ onAddClick }) => {
    return (
      <GridToolbarContainer>
        <div className="z-1 flex h-[3rem] w-full items-center p-1">
          <button
            id="RestaurantListAddRestaurantButton"
            onClick={onAddClick}
            className="flex items-center justify-center rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
          >
            <h1 className="text-md font-mont-md">+ Add a restaurant</h1>
          </button>
        </div>
      </GridToolbarContainer>
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: true
    },
    {
      field: 'restaurantType',
      headerName: 'Local type',
      type: 'string',
      width: 180,
      editable: true,
      renderEditCell: params => {
        const { id, value, api } = params
        return (
          <FormControl fullWidth>
            <Select
              value={value || ''}
              onChange={event => {
                const newValue = event.target.value
                // Aktualizuje wartość w modelu danych
                api.setEditCellValue({
                  id,
                  field: 'restaurantType',
                  value: newValue
                })
              }}
              sx={{
                fontSize: '0.875rem',
                padding: '4px',
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                  {
                    border: 0
                  },
                '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                  {
                    border: 0
                  },
                '& .MuiSelect-icon': { color: 'gray' }
              }}
            >
              {Object.values(LocalType).map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }
    },
    {
      field: 'city',
      headerName: 'City',
      type: 'string',
      width: 180,
      editable: true
    },
    {
      field: 'address',
      headerName: 'Address',
      type: 'string',
      width: 180,
      editable: true
    },
    {
      field: 'isVerified',
      headerName: 'Is verified?',
      type: 'boolean',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: false
    },
    {
      field: 'reservationDeposit',
      headerName: 'Deposit',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: true
    },
    {
      field: 'groupName',
      headerName: 'Group',
      width: 250,
      editable: true,
      renderEditCell: params => {
        const { id, value, api } = params
        const selectedGroup = groups.find(group => group.name === value)
        return (
          <FormControl fullWidth>
            <Select
              sx={{
                fontSize: '0.875rem',
                padding: '4px',
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                  {
                    border: 0
                  },
                '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                  {
                    border: 0
                  },
                '& .MuiSelect-icon': { color: 'gray' }
              }}
              value={selectedGroup ? value : ''}
              onChange={event => {
                const newValue = event.target.value
                api.setEditCellValue({
                  id,
                  field: 'groupName',
                  value: newValue
                })
              }}
            >
              {groups.map(group => (
                <MenuItem key={group.restaurantGroupId} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const currentRestaurant = rows.find(row => row.id === id)
        const isInEditMode = rowModesModel[id]?.mode === 'edit'
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={() => handleSaveClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() => handleCancelClick(id)}
              color="inherit"
            />
          ]
        }

        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Usuń"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edytuj"
            onClick={() => {
              if (currentRestaurant) {
                setSelectedRestaurant(currentRestaurant as RestaurantType)
                setIsDetailsDialogOpen(true)
                setIsReadOnly(false)
              }
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<ArrowForwardIos />}
            label="Details"
            id={
              'RestaurantSeeDetailsButton' +
              rows[parseInt(id.toString())].id +
              rows[parseInt(id.toString())].name
            }
            className="textPrimary"
            color="inherit"
            onClick={() =>
              navigate(
                `../restaurant/${rows[parseInt(id.toString())].restaurantId}/restaurant-dashboard`
              )
            }
          />
        ]
      }
    }
  ]

  const handleRegistrationSucces = () => {
    setRegisterSucces(true)
    populateRows()
  }

  const handleRowClick = (params: any) => {
    const rowData = rows.find(row => row.id === params.id)
    if (rowData) {
      setSelectedRestaurant(rowData as RestaurantType)
      setIsReadOnly(true)
      setIsDetailsDialogOpen(true)
    }
  }

  const closeDetailsDialog = () => {
    setSelectedRestaurant(null)
    setIsDetailsDialogOpen(false)
  }

  const handleSucces = () => {
    setIsDetailsDialogOpen(false)
    populateRows()
  }

  return (
    <div className="h-full w-full rounded-b-lg rounded-tr-lg ">
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowClick={handleRowClick}
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } }
        }}
        pageSizeOptions={[5, 10, 25]}
        slots={{
          toolbar: props => (
            <EditToolbar {...props} onAddClick={() => setIsDialogOpen(true)} />
          )
        }}
        className="border-0"
      />

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            width: '700px',
            maxWidth: 'none', // Usuwa domyślną maksymalną szerokość
            height: '92%', // Ustawia maksymalną wysokość na 100% dostępnej przestrzeni
            maxHeight: 'none', // Wyłącza ograniczenia wysokości
            margin: 0, // Usuwa marginesy, by dialog rozciągał się maksymalnie
            display: 'flex', // Umożliwia elastyczne układanie zawartości
            flexDirection: 'column' // Ustawia układ kolumnowy (przydatne dla treści)
          }
        }}
      >
        <DialogTitle className="text-center text-3xl font-bold dark:bg-black">
          <IconButton
            aria-label="close"
            onClick={() => setIsDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dark:bg-black scroll">
          <Box>
            {/* Show the registration form or the success message */}
            {!registerSucces ? (
              <RestaurantRegister
                onRegisterSucces={() => handleRegistrationSucces()}
              />
            ) : (
              <Box>
                <RegisterSuccess
                  onDialogClose={() => setIsDialogOpen(false)}
                  onRegisterSucces={() => setRegisterSucces(false)}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {selectedRestaurant && isDetailsDialogOpen && (
        <RestaurantDetails
          restaurant={selectedRestaurant}
          open={isDetailsDialogOpen}
          onClose={closeDetailsDialog}
          onSuccess={handleSucces}
          groups={groups}
          isReadOnly={isReadOnly}
        />
      )}

      <ConfirmationDialog
        open={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => handleDeleteRestaurant(restaurantToDelete)}
        confirmationText="Are you sure you want to delete this restaurant?"
      />
    </div>
  )
}

export default RestaurantListSection
