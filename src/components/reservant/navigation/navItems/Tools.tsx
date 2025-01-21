import React, { useContext, useState } from 'react'
import OutsideClickHandler from '../../../reusableComponents/OutsideClickHandler'
import User from '../../../../assets/images/user.jpg'
import CloseIcon from '@mui/icons-material/Close'

import {
  AccountCircle,
  BugReport,
  ChevronLeft,
  ChevronRight,
  Close,
  DarkMode,
  Language,
  LightMode,
  Logout,
  Restaurant,
  Settings
} from '@mui/icons-material'
import { CSSTransition } from 'react-transition-group'
import i18next from 'i18next'
import { ThemeProvider } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { Form, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { ThemeContext } from '../../../../contexts/ThemeContext'
import ErrorMes from '../../../reusableComponents/ErrorMessage'
import { fetchPOST } from '../../../../services/APIconn'
import { FetchError } from '../../../../services/Errors'
import RestaurantRegister from '../../restaurantManagement/register/restaurantRegister/RestaurantRegister'
import RegisterSuccess from '../../restaurantManagement/register/restaurantRegister/RegisterSuccess'
import { Alert, createTheme, IconButton, Switch } from '@mui/material'
import Dialog from '../../../reusableComponents/Dialog'

const Tools: React.FC = () => {
  const [t] = useTranslation('global')
  const [isPressed, setIsPressed] = useState(false)
  const [isComplaining, setIsComplaining] = useState(false)
  const [isBecomingRestauranter, setIsBecomingRestauranter] = useState(false)
  const [registerSucces, setRegisterSucces] = useState(false)
  const [activeMenu, setActiveMenu] = useState('main')
  const navigate = useNavigate()
  const mainHeight = 392
  const [menuHeight, setMenuHeight] = useState(mainHeight)
  const { toggleTheme } = useContext(ThemeContext)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [reportNote, setReportNote] = useState<string>('')
  const [alertMessage, setAlertMessage] = useState<string>('')

  const theme = createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: '#222222'
          },
          colorPrimary: {
            '&.Mui-checked': {
              color: '#64c3a6'
            }
          },
          track: {
            backgroundColor: '#222222',
            '.Mui-checked.Mui-checked + &': {
              backgroundColor: '#b1e1d2'
            }
          }
        }
      }
    }
  })

  const pressHandler = () => {
    setIsPressed(!isPressed)
  }

  const calcHeight = (el: any) => {
    setMenuHeight(el.offsetHeight)
  }

  const handleLanguageChange = (lang: string) => {
    i18next.changeLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
    setActiveMenu('main')
    setMenuHeight(mainHeight)
  }

  const ProfileButton = () => (
    <button
      id="profileDropdownItem"
      className="flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
      onClick={() => {
        const user = JSON.parse(Cookies.get('userInfo') as string)
        navigate(`profile/${user.userId}/account`)
      }}
    >
      <AccountCircle />
      <span className="ml-2">{t('tools.main.profile')}</span>
    </button>
  )

  const SettingsButton = () => (
    <button
      id="settingsDropdownItem"
      className="flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
      onClick={() => setActiveMenu('settings')}
    >
      <Settings />
      <span className="ml-2">{t('tools.main.settings')}</span>
      <ChevronRight className="ml-auto" />
    </button>
  )

  const LanguageButton = () => (
    <button
      id="languagesDropdownItem"
      className="flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
      onClick={() => setActiveMenu('languages')}
    >
      <Language />
      <span className="ml-2">{t('tools.main.language')}</span>
      <ChevronRight className="ml-auto" />
    </button>
  )

  const ThemeToggleButton = () => (
    <div className="flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5">
      {document.documentElement.className === 'dark' ? (
        <DarkMode />
      ) : (
        <LightMode />
      )}
      <span className="ml-2">{t('tools.main.mode')}</span>
      <Switch
        onClick={toggleTheme}
        className="ml-auto"
        defaultChecked={document.documentElement.className === 'dark'}
      />
    </div>
  )

  const ReportBugButton = () => {
    return (
      <button
        id="bugReportDropdownItem"
        className="flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
        onClick={() => {
          setIsComplaining(true)
        }}
      >
        <BugReport />
        <span className="ml-2">{t('tools.main.report')}</span>
      </button>
    )
  }
  const BecomeRestauranter = () => {
    return (
      <button
        id="RestauranterDropdownItem"
        className="flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
        onClick={() => {
          setIsBecomingRestauranter(true)
          setActiveMenu('main')
          setMenuHeight(mainHeight)
        }}
      >
        <Restaurant />
        <span className="ml-2">{t('tools.main.become')}</span>
      </button>
    )
  }

  const LogoutButton = () => (
    <Form method="post" action="/logout">
      <button
        id="logoutDropdownItem"
        type="submit"
        className="menu-item w-full flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
      >
        <Logout />
        <span className="ml-2">{t('tools.main.signout')}</span>
      </button>
    </Form>
  )

  const validate = () => {
    if (!reportNote) {
      setErrorMessage('Please tell us what happened.')
      return false
    }
    return true
  }

  const handleReportSubmit = async () => {
    try {
      let reportData: {
        description: string
      } = {
        description: reportNote
      }

      await fetchPOST('/reports/report-bug', JSON.stringify(reportData))
      setAlertMessage('Your report has been submitted successfully.')
    } catch (error) {
      if (error instanceof FetchError) console.error(error.formatErrors())
    } finally {
      setIsComplaining(false)
      setReportNote('')
    }
  }

  return (
    <>
      <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
        <button
          id="ToolsButton"
          className="flex h-10 w-10 items-center justify-center"
          onClick={pressHandler}
        >
          <img src={User} alt="logo" className="rounded-full" />
        </button>
        {isPressed && (
          <div
            style={{ height: menuHeight }}
            className="nav-dropdown z-[1] dark:bg-black"
          >
            <CSSTransition
              in={activeMenu === 'main'}
              unmountOnExit
              timeout={500}
              classNames="menu-primary"
              onEnter={calcHeight}
            >
              <div className="w-full p-2 flex flex-col gap-2">
                <ThemeProvider theme={theme}>
                  <ProfileButton />
                  <SettingsButton />
                  <LanguageButton />
                  <ThemeToggleButton />
                  <ReportBugButton />
                  <LogoutButton />
                </ThemeProvider>
              </div>
            </CSSTransition>

            <CSSTransition
              in={activeMenu === 'settings'}
              unmountOnExit
              timeout={500}
              classNames="menu-secondary"
              onEnter={calcHeight}
            >
              <div className="w-full p-2 flex flex-col gap-4">
                <button
                  id="backFromSettingsDropdownItem"
                  className="menu-item flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
                  onClick={() => setActiveMenu('main')}
                >
                  <ChevronLeft />
                </button>

                <BecomeRestauranter />
              </div>
            </CSSTransition>

            <CSSTransition
              in={activeMenu === 'languages'}
              unmountOnExit
              timeout={500}
              classNames="menu-secondary"
              onEnter={calcHeight}
            >
              <div className="w-full p-2 flex flex-col gap-2">
                <button
                  id="backFromLanguagesDropdownItem"
                  className="menu-item flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
                  onClick={() => setActiveMenu('main')}
                >
                  <ChevronLeft />
                </button>
                <button
                  className={`menu-item w-full flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5 ${
                    i18next.language === 'en' && 'bg-grey-1 dark:bg-grey-5'
                  }`}
                  onClick={() => handleLanguageChange('en')}
                >
                  <Language className="dark:text-white" />
                  <span className="ml-2 dark:text-white">English</span>
                </button>
                <button
                  className={`menu-item w-full flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5 ${
                    i18next.language === 'pl' && 'bg-grey-1 dark:bg-grey-5'
                  }`}
                  onClick={() => handleLanguageChange('pl')}
                >
                  <Language className="dark:text-white" />
                  <span className="ml-2 dark:text-white">Polski</span>
                </button>
              </div>
            </CSSTransition>
          </div>
        )}
      </OutsideClickHandler>
      {isComplaining && (
        <Dialog
          open={isComplaining}
          onClose={() => {
            setIsComplaining(false)
            setErrorMessage('')
          }}
          title={t('tools.main.report')}
        >
          <div className="flex flex-col gap-4 dark:text-grey-1 p-4 w-[400px]">
            <label htmlFor="report-type" className="text-sm font-bold">
              {t('reservation.complain-topic')}?
            </label>
            <textarea
              id="report-note"
              value={reportNote}
              onChange={e => setReportNote(e.target.value)}
              placeholder={t('reservation.describe-details')}
              className="border-[1px] rounded-md p-2 h-20 scroll dark:text-grey-1 dark:bg-black"
            />
            {errorMessage && <ErrorMes msg={errorMessage} />}
            <button
              type="submit"
              onClick={() => {
                if (validate()) handleReportSubmit()
              }}
              className="bg-primary text-white rounded-md p-2 transition hover:bg-secondary"
            >
              {t('reservation.submit')}
            </button>
          </div>
        </Dialog>
      )}
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
      {isBecomingRestauranter && (
        <Dialog
          open={isBecomingRestauranter}
          onClose={() => setIsBecomingRestauranter(false)}
          title={t('restaurant-register.restaurant-register')}
        >
          {!registerSucces ? (
            <RestaurantRegister
              onRegisterSucces={() => setRegisterSucces(true)}
            />
          ) : (
            <RegisterSuccess
              onDialogClose={() => setIsBecomingRestauranter(false)}
              onRegisterSucces={() => setRegisterSucces(false)}
            />
          )}
        </Dialog>
      )}
    </>
  )
}

export default Tools
