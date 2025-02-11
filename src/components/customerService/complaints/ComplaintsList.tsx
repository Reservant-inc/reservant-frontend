import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import { Tooltip, IconButton, ThemeProvider, Alert } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { fetchGET } from '../../../services/APIconn'
import { useNavigate, useParams } from 'react-router-dom'
import ComplaintDetails from './ComplaintDetails'
import CloseIcon from '@mui/icons-material/Close'

import { ThemeContext } from '../../../contexts/ThemeContext'
import { PaginationType, ReportType, UserType } from '../../../services/types'
import { useTranslation } from 'react-i18next'

const ComplaintsList: React.FC = () => {
  const [reports, setReports] = useState<ReportType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<UserType>({} as UserType)
  const [isManager, setIsManager] = useState<boolean>(false)

  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId?: string }>();
  const { isDark, lightTheme, darkTheme } = useContext(ThemeContext);
  const [t] = useTranslation('global')

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchReports()
    }
  }, [userId]);

  useEffect(() => {
    if (reportId) {
      navigate('/customer-service/reports')
    }
  }, [reports])

  const fetchUserDetails = async () => {
    try {
      const user = await fetchGET('/user');
      setUserId(user.userId);
      setCurrentUser(user);
      setIsManager(user.roles.includes('CustomerSupportManager'));
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchReports = async () => {
    setLoading(true)
    try {
      const url = isManager
        ? '/reports?perPage=-1'
        : `/reports?assignedToId=${userId}&perPage=-1`;
      const response: PaginationType = await fetchGET(url);
      setReports(response.items as ReportType[]);
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
      field: 'isResolved',
      headerName: t('customer-service.reports.resolved'),
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <span>{params.row.resolutionDate ? `${t('complaints.yes')}` : `${t('complaints.no')}`}</span>
      )
    },
    {
      field: 'reportDate',
      headerName: t('customer-service.reports.report-date'),
      flex: 1,
      sortable: true
    },
    {
      field: 'createdBy',
      headerName: t('customer-service.reports.submitted-by'),
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const createdBy = params.row.createdBy
        return createdBy ? (
          <Tooltip title={`${createdBy.userId}`}>
            <span>
              {createdBy.firstName} {createdBy.lastName}
            </span>
          </Tooltip>
        ) : (
          <span>Unknown</span>
        )
      }
    },
    {
      field: 'category',
      headerName: t('customer-service.reports.category'),
      flex: 1,
      sortable: true
    },
    {
      field: 'description',
      headerName: t('customer-service.reports.description'),
      flex: 1,
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
      field: 'resolvedBy',
      headerName: t('customer-service.reports.resolved-by'),
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const resolvedBy = params.row.resolvedBy
        return resolvedBy ? (
          <Tooltip title={`${resolvedBy.userId}`}>
            <span>
              {resolvedBy.firstName} {resolvedBy.lastName}
            </span>
          </Tooltip>
        ) : (
          <span>-</span>
        )
      }
    },
    {
      field: 'resolutionDate',
      headerName: t('customer-service.reports.resolution-date'),
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <span>
          {params.row.resolutionDate
            ? new Date(params.row.resolutionDate).toLocaleDateString()
            : '-'}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: t('customer-service.reports.actions'),
      flex: 1,
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
    <>
      <div className="h-full w-full flex flex-col">
        <h1 className="text-lg font-semibold p-2">
          {t('customer-service.reports.reports')}
        </h1>
        <div className="flex gap-2 h-[calc(100%-44px)]">
          <div
            className={`h-full ${
              reportId ? 'w-[calc(100%-400px)]' : 'w-full'
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
                      createdBy: report.createdBy,
                      resolutionDate: report.resolutionDate,
                      resolvedBy: report.resolvedBy,
                      isResolved: report.resolutionDate
                    }))}
                    columns={columns}
                    disableRowSelectionOnClick
                    autosizeOnMount={true}
                    className="scroll"
                    autoPageSize={true}
                    sx={{
                      '& .MuiDataGrid-footerContainer': {
                        borderTop: 'none'
                      }
                    }}
                  />
                </ThemeProvider>
              ) : (
                <div className="flex justify-center items-center h-full text-lg">
                  {t('complaints.noComplaintsFound')}
                </div>
              )}
            </div>
          </div>

          {reportId && selectedReport && (
            <div className="h-full w-[400px]">
              <ComplaintDetails
                report={selectedReport}
                onClose={closeSidePanel}
                refreshReports={fetchReports}
                setAlertMessage={setAlertMessage}
                isManager={isManager}
                currentUser={currentUser}
              />
            </div>
          )}
        </div>
      </div>
      {alertMessage && (
        <div className="fixed bottom-2 left-2">
          <Alert
            variant="filled"
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertMessage('')
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertMessage}
          </Alert>
        </div>
      )}
    </>
  )
}

export default ComplaintsList
