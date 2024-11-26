import React, { useEffect, useState } from 'react'
import { Box, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import RestaurantRegister from '../../../register/restaurantRegister/RestaurantRegister'
import {
  GridToolbarContainer,
  GridRowModesModel,
  GridColDef,
  GridRowsProp,
  DataGrid,
  GridSlots,
  GridActionsCellItem
} from '@mui/x-data-grid'
import { fetchGET } from '../../../../services/APIconn'
import { LocalType } from '../../../../services/enums'
import { RestaurantType } from '../../../../services/types'
import { ArrowForwardIos, Close } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

  const navigate = useNavigate()

  const { t } = useTranslation("global");

  useEffect(() => {
    const populateRows = async () => {
      try {
        const response = await fetchGET('/my-restaurant-groups')
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
              isVerified: response2.restaurants[i].isVerified
            })
          }
        }

        setRows(tmp)
      } catch (error) {
        console.error('Error populating table', error)
      }
    }
    populateRows()
  }, [])

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
    { field: 'restaurantId', headerName: 'ID', width: 180, editable: false },
    {
      field: 'name',
      headerName: 'Name',
      type: 'string',
      width: 180,
      align: 'left',
      headerAlign: 'left',
      editable: false
    },
    {
      field: 'restaurantType',
      headerName: 'Local type',
      type: 'string',
      width: 180,
      editable: false
    },
    {
      field: 'city',
      headerName: 'City',
      type: 'string',
      width: 180,
      editable: false
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
      field: 'groupName',
      headerName: 'Group',
      width: 180,
      editable: false,
      type: 'string'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
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
    </div>
  )
}

export default RestaurantListSection
