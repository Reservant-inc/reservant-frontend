import React, { useState } from 'react'
import LogoSecondary from '../../../assets/images/LOGO-SECONDARY.png'
import LogoPrimary from '../../../assets/images/LOGO-PRIMARY.png'
import useWindowDimensions from '../../../hooks/useWindowResize'
import MenuIcon from '@mui/icons-material/Menu'
import OutsideClickHandler from '../../reusableComponents/OutsideClickHandler'
import {
  ChevronLeft,
  ChevronRight,
  DarkMode,
  Language,
  LightMode,
  Logout
} from '@mui/icons-material'
import i18next from 'i18next'
import { createTheme, Switch, ThemeProvider } from '@mui/material'
import { CSSTransition } from 'react-transition-group'
import { Form } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

const NavBar: React.FC = () => {
  const [t] = useTranslation('global')
  const [isPressed, setIsPressed] = useState(false)
  const [activeMenu, setActiveMenu] = useState('main')
  const mainHeight = 240
  const [menuHeight, setMenuHeight] = useState(mainHeight)
  const [isDark, setIsDark] = useState(localStorage.theme === 'dark')

  const size = useWindowDimensions()

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

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.theme = isDark ? 'dark' : 'light'
    setIsDark(isDark)
  }

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
        className="menu-item flex h-14 w-full items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
      >
        <Logout />
        <span className="ml-2">{t('tools.main.signout')}</span>
      </button>
    </Form>
  )

  return (
    <div className="flex h-full w-full items-center shadow-md dark:bg-black">
      <div className="mx-1 flex h-full w-full items-center p-1">
        <div className="flex h-full flex-1 items-center gap-2">
          <img
            src={isDark ? LogoSecondary : LogoPrimary}
            alt="logo"
            className="h-[45px] max-h-[45px] min-w-[45px] max-w-[45px]"
          />
          {size.width > 880 && (
            <h1
              className={
                'font-mont-md text-xl' +
                (isDark ? ' text-secondary' : ' text-primary')
              }
            >
              RESERVANT CUSTOMER SERVICE
            </h1>
          )}
        </div>

        <div className="flex h-full items-center justify-end gap-3">
          <OutsideClickHandler
            onOutsideClick={pressHandler}
            isPressed={isPressed}
          >
            <button
              id="ToolsButton"
              className="flex h-10 w-10 items-center justify-center bg-grey-1 dark:bg-grey-5 rounded-full"
              onClick={pressHandler}
            >
              <MenuIcon className="dark:text-white" />
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
                      <LanguageButton />
                      <ThemeToggleButton />
                      <LogoutButton />
                    </ThemeProvider>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={activeMenu === 'languages'}
                  unmountOnExit
                  sty
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
                      className={`menu-item flex h-14 items-center rounded-lg p-2 ${
                        i18next.language === 'en' && 'bg-grey-1 dark:bg-grey-5'
                      }`}
                      onClick={() => handleLanguageChange('en')}
                    >
                      <Language className="dark:text-white" />
                      <span className="ml-2 dark:text-white">English</span>
                    </button>
                    <button
                      className={`menu-item flex h-14 items-center rounded-lg p-2 hover:bg-grey-1 dark:hover:bg-grey-5 ${
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
        </div>
      </div>
    </div>
  )
}

export default NavBar
