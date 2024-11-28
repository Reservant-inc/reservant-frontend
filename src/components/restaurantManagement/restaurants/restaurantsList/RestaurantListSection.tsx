import React, { useEffect, useState } from 'react'
import { Box, Dialog, DialogTitle, DialogContent, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import RestaurantRegister from '../../../register/restaurantRegister/RestaurantRegister'
import {
  GridToolbarContainer,
  GridRowModesModel,
  GridColDef,
  GridRowsProp,
  DataGrid,
  GridSlots,
  GridActionsCellItem,
  GridRowId,
  GridRowModes
} from '@mui/x-data-grid'
import { fetchDELETE, fetchGET, fetchPUT } from '../../../../services/APIconn'
import { LocalType } from '../../../../services/enums'
import { GroupType, RestaurantType } from '../../../../services/types'
import { ArrowForwardIos, Close, Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ConfirmationDialog from '../../../reusableComponents/ConfirmationDialog'
import { GridCellParams } from '@mui/x-data-grid';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

const RestaurantListSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
  const [restaurantToDelete, setRestaurantToDelete] = useState<string>('')
  const [groups, setGroups] = useState<GroupType[]>([]) 


  const navigate = useNavigate()

  const { t } = useTranslation("global");

  const populateRows = async () => {
    try {
      const response = await fetchGET('/my-restaurant-groups')
      setGroups(response);
      const tmp: RestaurantType[] = []
      let indx = 0
      for (const group of response) {
        const response2 = await fetchGET(
          `/my-restaurant-groups/${group.restaurantGroupId}`
        )
       
        for (const i in response2.restaurants) {
          tmp.push({
            id: Number(indx++),
            groupName: group.name,
            restaurantId: response2.restaurants[i].restaurantId,
            name: response2.restaurants[i].name,
            restaurantType: response2.restaurants[i]
              .restaurantType as LocalType,
            address: response2.restaurants[i].address,
            city: response2.restaurants[i].city,
            isVerified: response2.restaurants[i].isVerified,
            reservationDeposit: response2.restaurants[i].reservationDeposit,
            maxReservationDurationMinutes: response2.restaurants[i].maxReservationDurationMinutes,
            idCard: response2.restaurants[i].idCard,
            businessPermission: response2.restaurants[i].businessPermission,
            rentalContract: response2.restaurants[i].rentalContract,
            alcoholLicense: response2.restaurants[i].alcoholLicense,
            tags: response2.restaurants[i].tags,
            provideDelivery: response2.restaurants[i].provideDelivery,
            logo: response2.restaurants[i].logo,
            photos: response2.restaurants[i].photos,
            description: response2.restaurants[i].description,
            nip: response2.restaurants[i].nip,
            postalIndex: response2.restaurants[i].postalIndex,
            location: response2.restaurants[i].location
          })
        }
        
      }
      setRows(tmp)
      console.log("aa",rows);
    } catch (error) {
      console.error('Error populating table', error)
    }
  }

  useEffect(() => {
    
    populateRows()
  }, [])

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel(prevModel => ({
      ...prevModel,
      [id]: { mode: GridRowModes.Edit } // Using GridRowModes.Edit
    }))
  }

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
      
      const updatedRow = { ...newRow, isNew: false }
      delete updatedRow.isVerified;
      console.log(updatedRow)
      await fetchPUT(`/my-restaurants/${newRow.restaurantId}`, JSON.stringify(updatedRow))
      populateRows() // Refetch the data after update
      return updatedRow
    } catch (error) {
      console.error('Error updating restaurant', error)
      return newRow
    }
  }

  const EditToolbar = (props: EditToolbarProps) => {
    return (
      <GridToolbarContainer>
        <div className="z-1 flex h-[3rem] w-full items-center p-1">
          <button
            id="RestaurantListAddRestaurantButton"
            onClick={() => setIsDialogOpen(true)}
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
      renderEditCell: (params) => {
        const { id, value, api } = params;
        return (
          <FormControl fullWidth>
            <Select
              value={value || ''}
              onChange={(event) => {
                const newValue = event.target.value;
                // Aktualizuje wartość w modelu danych
                api.setEditCellValue({ id, field: 'restaurantType', value: newValue });
              }}
              sx={{
                fontSize: '0.875rem',
                padding: '4px',
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
                '& .MuiSelect-icon': { color: 'gray' }
              }}
            >
              {Object.values(LocalType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
    }
    ,
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
      editable: true,
    },
    {
      field: 'groupName',
      headerName: 'Group',
      width: 250,
      editable: true,
      renderEditCell: (params) => {
        const { id, value, api } = params;
        return (
          <FormControl fullWidth>
            <Select
              sx={{
                fontSize: '0.875rem',
                padding: '4px',
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
                '& .MuiSelect-icon': { color: 'gray' }
              }}
              value={value || ''}
              onChange={(event) => {
                const newValue = event.target.value;
                api.setEditCellValue({ id, field: 'groupName', value: newValue });
              }}
            >
              {groups.map((group) => (
                <MenuItem key={group.restaurantGroupId} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,
      cellClassName: 'actions',
      getActions: ({ id }) => {
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
            onClick={() => handleEditClick(id)}
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

  const handleRowClick = (params: any) => {
    // const rowData = params.row;
  }

  return (
    <div className="h-full w-full rounded-b-lg rounded-tr-lg bg-white dark:bg-black">
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        onRowClick={handleRowClick}
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
      <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          sx={{
            '& .MuiDialog-paper': {
              width: '35%', 
              maxWidth: 'none',  // Usuwa domyślną maksymalną szerokość
              height: '92%',    // Ustawia maksymalną wysokość na 100% dostępnej przestrzeni
              maxHeight: 'none', // Wyłącza ograniczenia wysokości
              margin: 0,         // Usuwa marginesy, by dialog rozciągał się maksymalnie
              display: 'flex',   // Umożliwia elastyczne układanie zawartości
              flexDirection: 'column', // Ustawia układ kolumnowy (przydatne dla treści)

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
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className='dark:bg-black'>
          <Box>
            <RestaurantRegister />
          </Box>
        </DialogContent>
      </Dialog>

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
