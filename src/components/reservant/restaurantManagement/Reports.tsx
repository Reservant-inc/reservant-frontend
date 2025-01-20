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
import { useTranslation } from 'react-i18next'

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
  const [t] = useTranslation('global')

  useEffect(() => {
    populateRows()
  }, [])

  const populateRows = async () => {
    try {
      const response = await fetchGET(`/my-restaurants/${restaurantId}/reports`)

      let reports: any[] = []

      if (response.items.length)
        for (const i in response.items) {
          reports.push({
            id: Number(i),
            reportId: response.items[i].reportId,
            description: response.items[i].description,
            visitId: response.items[i].visit.visitId,
            reportedUserId: response.items[i].reportedUser?.userId,
            reportDate: new Date(response.items[i].reportDate).toLocaleString(),
            category: response.items[i].category,
            createdBy: response.items[i].createdBy,
            reportedUser: response.items[i].reportedUser
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
      headerName: t('customer-service.reports.report-id'),
      type: 'string',
      flex: 0.05,
      editable: false
    },
    {
      field: 'description',
      headerName: t('customer-service.reports.description'),
      type: 'string',
      flex: 0.3,
      editable: false
    },
    {
      field: 'visitId',
      headerName: t('customer-service.reports.visit-id'),
      type: 'string',
      flex: 0.05,
      editable: false
    },
    {
      field: 'reportedUserId',
      headerName: t('customer-service.reports.reported-user-id'),
      type: 'string',
      flex: 0.2,
      editable: false
    },
    {
      field: 'reportDate',
      headerName: t('customer-service.reports.report-date'),
      type: 'string',
      flex: 0.1,
      editable: false
    },
    {
      field: 'category',
      headerName: t('customer-service.reports.category'),
      type: 'string',
      flex: 0.2,
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
