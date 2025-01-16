import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NavBar from './nav/NavBar'
import ReportIcon from '@mui/icons-material/Report'
import Cookies from 'js-cookie'
import ThemeContextProvider from '../../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import ThreadContextProvider from '../../contexts/ThreadContext'

const CustomerService: React.FC = () => {
  const navigate = useNavigate()

  const [t] = useTranslation('global')

  const isCustomerSupportManager = () => {
    if (Cookies.get('userInfo'))
      return Boolean(
        JSON.parse(Cookies.get('userInfo') as string).roles.includes(
          'CustomerSupportManager'
        )
      )
    return false
  }
  return (
    <div className="w-full h-full bg-grey-1 dark:bg-grey-5 flex flex-col dark:text-white">
      <ThemeContextProvider>
        <ThreadContextProvider>
          <div className="w-full h-[3.5rem] bg-white">
            <NavBar />
          </div>
          <div className="flex gap-2 p-2 h-[calc(100%-3.5rem)] w-full">
            <div className="w-64 h-full">
              <div className="w-full h-full bg-white dark:bg-black rounded-lg shadow-lg flex flex-col p-2 gap-2">
                <h1 className="w-full text-xl dark:text-white font-mont-bd text-center">
                  Menu
                </h1>
                <button
                  onClick={() => navigate('reports')}
                  className="w-full p-3 flex gap-4 text-left dark:text-white rounded-md hover:bg-grey-0 hover:dark:bg-grey-5 transition"
                >
                  <ReportIcon />
                  <h1>{t('customer-service.reports.reports')}</h1>
                </button>
                {isCustomerSupportManager() && (
                  <button
                    onClick={() => navigate('pending-restaurants')}
                    className="w-full p-3 flex gap-4 text-left dark:text-white rounded-md hover:bg-grey-0 hover:dark:bg-grey-5 transition"
                  >
                    <ReportIcon />
                    <h1>{t('customer-service.reports.pending-restaurants')}</h1>
                  </button>
                )}
              </div>
            </div>
            <div className="h-full w-[calc(100%-16rem)] rounded-lg">
              <Outlet />
            </div>
          </div>
        </ThreadContextProvider>
      </ThemeContextProvider>
    </div>
  )
}

export default CustomerService
