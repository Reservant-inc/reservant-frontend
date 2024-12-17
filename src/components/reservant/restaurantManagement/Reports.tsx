import React, { useEffect, useState } from 'react'
import {
  GridRowsProp,
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridRowModel,
  GridSlots
} from '@mui/x-data-grid'
import { fetchGET } from '../../../services/APIconn'
import { useParams } from 'react-router-dom'
import { ReportType } from '../../../services/types'

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

export default function Reports() {
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const { restaurantId } = useParams()

  useEffect(() => {
    populateRows()
  }, [])

  const populateRows = async () => {
    try {
      const response = await fetchGET(`/my-restaurants/${restaurantId}/reports`)

      console.log(response)
      let reports: (ReportType & { id: number })[] = []

      if (response.length)
        for (const i in response) {
          reports.push({
            id: Number(i),
            reportId: response.reportId,
            description: response.description,
            visitId: response.visitId,
            reportedUserId: response.reportedUserId,
            reportDate: response.reportDate,
            category: response.category,
            createdBy: response.createdBy,
            reportedUser: response.reportedUser
          })
        }

      setRows(reports)
    } catch (error) {
      console.error('Error populating table', error)
    }
  }

  const EditToolbar = (props: EditToolbarProps) => {
    return (
      <GridToolbarContainer>
        <div className="z-1 flex h-[3rem] w-full items-center p-1"></div>
      </GridToolbarContainer>
    )
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    setRows(prevRows =>
      prevRows.map(row => (row.id === newRow.id ? updatedRow : row))
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef[] = [
    {
      field: 'reportId',
      headerName: 'Report ID',
      type: 'string',
      width: 180,
      editable: false
    },
    {
      field: 'description',
      headerName: 'Description',
      type: 'string',
      width: 300,
      editable: false
    },
    {
      field: 'visitId',
      headerName: 'Visit ID',
      type: 'string',
      width: 180,
      editable: false
    },
    {
      field: 'reportedUserId',
      headerName: 'Reported User ID',
      type: 'string',
      width: 220,
      editable: false
    },
    {
      field: 'reportDate',
      headerName: 'Report Date',
      type: 'string',
      width: 200,
      editable: false
    },
    {
      field: 'category',
      headerName: 'Category',
      type: 'string',
      width: 180,
      editable: false
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
    </>
  )
}
