import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import { Tooltip, IconButton, ThemeProvider } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { fetchGET } from '../../../services/APIconn'
import { useNavigate, useParams } from 'react-router-dom'
import ComplaintDetails from './ComplaintDetails'
import { ThemeContext } from '../../../contexts/ThemeContext'

const ComplaintsList: React.FC = () => {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { reportId } = useParams<{ reportId: string }>()
  const { isDark, lightTheme, darkTheme } = useContext(ThemeContext)

  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    if (reportId) {
      navigate('/customer-service/reports')
    }
  }, [reports])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const response = await fetchGET('/reports')
      setReports(response)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedReport = reports.find(
    report => report.reportId === parseInt(reportId || '', 10)
  )

  const closeSidePanel = () => {
    navigate('/customer-service/reports')
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      sortable: true
    },
    {
      field: 'reportDate',
      headerName: 'Report Date',
      flex: 1,
      sortable: true
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      sortable: true
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.row.description || 'No description'}>
          <span>
            {params.row.description?.length > 50
              ? `${params.row.description.substring(0, 50)}...`
              : params.row.description || 'No description'}
          </span>
        </Tooltip>
      )
    },
    {
      field: 'createdBy',
      headerName: 'Submitted By',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const createdBy = params.row.createdBy
        return createdBy ? (
          <Tooltip title={`${createdBy.firstName} ${createdBy.lastName}`}>
            <span>{createdBy.userId}</span>
          </Tooltip>
        ) : (
          <span>Unknown</span>
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip
          title={
            reportId === params.row.id.toString()
              ? 'Close Details'
              : 'View Details'
          }
        >
          <span>
            <IconButton
              onClick={() =>
                reportId === params.row.id.toString()
                  ? closeSidePanel()
                  : navigate(`/customer-service/reports/${params.row.id}`)
              }
              style={{
                visibility:
                  reportId && reportId !== params.row.id.toString()
                    ? 'hidden'
                    : 'visible'
              }}
            >
              {reportId === params.row.id.toString() ? (
                <ChevronLeftIcon color="action" />
              ) : (
                <ChevronRightIcon color="action" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )
    }
  ]

  return (
    <div className="h-full w-full flex flex-col">
      <h1 className="text-lg font-semibold p-2">Complaints</h1>
      <div className="flex gap-2 h-full">
        <div
          className={`h-full ${
            reportId ? 'w-[75%]' : 'w-full'
          } transition-all flex flex-col`}
        >
          <div className="flex-grow overflow-hidden bg-white dark:bg-black rounded-lg shadow-md">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <CircularProgress />
              </div>
            ) : reports.length > 0 ? (
              <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <DataGrid
                  rows={reports.map(report => ({
                    id: report.reportId,
                    reportDate: new Date(
                      report.reportDate
                    ).toLocaleDateString(),
                    category: report.category,
                    description: report.description,
                    createdBy: report.createdBy
                  }))}
                  columns={columns}
                  pageSizeOptions={[5, 10, 25, 50]}
                  disableRowSelectionOnClick
                  className="h-full"
                />
              </ThemeProvider>
            ) : (
              <div className="flex justify-center items-center h-full text-lg">
                No complaints found.
              </div>
            )}
          </div>
        </div>
        {reportId && (
          <div className="h-full w-[25%] bg-gray-100 dark:bg-gray-800 overflow-y-auto scroll">
            <ComplaintDetails
              report={selectedReport}
              onClose={closeSidePanel}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ComplaintsList
