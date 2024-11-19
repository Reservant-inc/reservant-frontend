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
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export interface ToolsProps {
  setIsDark: Function
}

const Tools: React.FC<ToolsProps> = ({ setIsDark }) => {
  const [t] = useTranslation('global')

  const [isPressed, setIsPressed] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [activeMenu, setActiveMenu] = useState('main')

  const navigate = useNavigate()

  const mainHeight = 360

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
    if (!(document.documentElement.className === 'dark')) {
      localStorage.theme = 'dark'
      document.documentElement.classList.add('dark')

      setIsDark(true)
      return
    }
    localStorage.theme = 'light'
    document.documentElement.classList.remove('dark')
    setIsDark(false)
  }

  function calcHeight(el: any) {
    const height = el.offsetHeight
    setMenuHeight(height)
  }

  const pressHandler = () => {
    setIsPressed(!isPressed)
  }

  const setLanguage = (lang: string) => {
    i18next.changeLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
    setIsChanged(!isChanged)
  }

  function DropdownItem(props: any) {
    const onClicked = () => {
      if (props.logout === true) {
        Cookies.remove('token')
        Cookies.remove('userInfo')
        navigate('/')
      }

      if (props.profile) {
        const user = JSON.parse(Cookies.get('userInfo') as string)
        navigate(`profile/${user.userId}/account`)
      }

      props.goToMenu && setActiveMenu(props.goToMenu)

      if (props.language) {
        setLanguage(props.language)
        setIsPressed(false)
        setMenuHeight(mainHeight)
      }
    }

    return (
      <div className="p-2 hover:cursor-pointer">
        <a
          id={props.id}
          className={
            props.className
              ? props.className
              : 'menu-item flex flex h-14 items-center rounded-lg p-2 text-black hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5'
          }
          onClick={onClicked}
        >
          <span className="icon-button">{props.leftIcon}</span>
          <div className="p-1">{props.children}</div>
          <span className="icon-right ml-auto">{props.rightIcon}</span>
        </a>
      </div>
    )
  }

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <button
        //do czego..
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
            <div className="w-full">
              <ThemeProvider theme={theme}>
                <DropdownItem
                  leftIcon={<AccountCircle />}
                  id="profileDropdownItem"
                  profile={true}
                >
                  {t('tools.main.profile')}{' '}
                </DropdownItem>
                <DropdownItem
                  leftIcon={<Settings />}
                  rightIcon={<ChevronRight />}
                  id="settingsDropdownItem"
                  goToMenu="settings"
                >
                  {t('tools.main.settings')}{' '}
                </DropdownItem>
                <DropdownItem
                  leftIcon={<Language />}
                  rightIcon={<ChevronRight />}
                  goToMenu="languages"
                  id="languagesDropdownItem"
                >
                  {t('tools.main.language')}{' '}
                </DropdownItem>
                <DropdownItem
                  className="menu-item flex flex h-14 cursor-default items-center rounded-lg p-2 text-black  hover:bg-grey-1 dark:text-grey-1 dark:hover:bg-grey-5"
                  leftIcon={
                    document.documentElement.className === 'dark' ? (
                      <DarkMode />
                    ) : (
                      <LightMode />
                    )
                  }
                  rightIcon={
                    <Switch
                      onClick={toggleTheme}
                      id="ToolsThemeSwitch"
                      className="ToolsThemeSwitch"
                      defaultChecked={
                        document.documentElement.className === 'dark'
                      }
                    />
                  }
                  id="ThemeDropdownItem"
                >
                  {t('tools.main.mode')}{' '}
                </DropdownItem>
                <DropdownItem
                  leftIcon={<Logout />}
                  id="logoutDropdownItem"
                  logout={true}
                >
                  {t('tools.main.signout')}{' '}
                </DropdownItem>
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
            <div className="w-full">
              <DropdownItem
                leftIcon={<ChevronLeft />}
                id="backFromSettingsDropdownItem"
                goToMenu="main"
              />
              <DropdownItem
                leftIcon={<Settings />}
                id="SettingFiller1DropdownItem"
              >
                {' '}
                {t('tools.settings.setting')}{' '}
              </DropdownItem>
              <DropdownItem
                leftIcon={<Settings />}
                id="SettingFiller2DropdownItem"
              >
                {' '}
                {t('tools.settings.setting')}{' '}
              </DropdownItem>
              <DropdownItem
                leftIcon={<Settings />}
                id="SettingFiller3DropdownItem"
              >
                {' '}
                {t('tools.settings.setting')}{' '}
              </DropdownItem>
              <DropdownItem
                leftIcon={<Settings />}
                id="SettingFiller4DropdownItem"
              >
                {' '}
                {t('tools.settings.setting')}{' '}
              </DropdownItem>
            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === 'languages'}
            unmountOnExit
            timeout={500}
            classNames="menu-secondary"
            onEnter={calcHeight}
          >
            <div className="w-full">
              <DropdownItem
                leftIcon={<ChevronLeft />}
                id="backFromLanguagesDropdownItem"
                goToMenu="main"
              />
              <DropdownItem
                leftIcon={<Language />}
                goToMenu="main"
                id="EnglishDropdownItem"
                language="en"
                className={
                  i18next.language === 'en'
                    ? 'menu-item flex flex h-14 cursor-default  items-center rounded-lg bg-grey-1 p-2 text-black dark:bg-grey-5 dark:text-grey-1 '
                    : ''
                }
              >
                {' '}
                English{' '}
              </DropdownItem>
              <DropdownItem
                leftIcon={<Language />}
                goToMenu="main"
                id="PolishDropdownItem"
                language="pl"
                className={
                  i18next.language === 'pl'
                    ? 'menu-item flex flex h-14 cursor-default  items-center rounded-lg bg-grey-1 p-2 text-black dark:bg-grey-5 dark:text-grey-1 '
                    : ''
                }
              >
                {' '}
                Polski{' '}
              </DropdownItem>
            </div>
          </CSSTransition>
        </div>
      )}
    </OutsideClickHandler>
  )
}

export default Tools
