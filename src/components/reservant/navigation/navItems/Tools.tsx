import React, { useState } from 'react'
import OutsideClickHandler from '../../../reusableComponents/OutsideClickHandler'
import User from '../../../../assets/images/user.jpg'
import { Switch, createTheme } from '@mui/material'
import {
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  DarkMode,
  Language,
  LightMode,
  Logout,
  Settings
} from '@mui/icons-material'
import { CSSTransition } from 'react-transition-group'
import i18next from 'i18next'
import { ThemeProvider } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { Form, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export interface ToolsProps {
  setIsDark: Function
}

const Tools: React.FC<ToolsProps> = ({ setIsDark }) => {
  const [t] = useTranslation('global')
  const [isPressed, setIsPressed] = useState(false)
  const [activeMenu, setActiveMenu] = useState('main')
  const navigate = useNavigate()
  const mainHeight = 328
  const [menuHeight, setMenuHeight] = useState(mainHeight)

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

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.theme = isDark ? 'dark' : 'light'
    setIsDark(isDark)
  }

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

  return (
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
              <button className="menu-item w-full flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5">
                <Settings />
                <span className="ml-2">{t('tools.settings.setting')} </span>
              </button>
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
  )
}

export default Tools
