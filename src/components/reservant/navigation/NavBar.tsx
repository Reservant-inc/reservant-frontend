import React, { useContext, useState } from 'react'
import LogoSecondary from '../../../assets/images/LOGO-SECONDARY.png'
import LogoPrimary from '../../../assets/images/LOGO-PRIMARY.png'
import Sections from './navItems/MenuSections'
import Tools from './navItems/Tools'
import Notifications from './navItems/Notifications/Notifications'
import Threads from './navItems/Threads/Threads'
import useWindowDimensions from '../../../hooks/useWindowResize'
import { ThemeContext } from '../../../contexts/ThemeContext'
import SearchBar from './navItems/Friends/SearchBar'
import { Button } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub';
import ShopIcon from '@mui/icons-material/Shop';

const NavBar: React.FC = () => {
  const { isDark } = useContext(ThemeContext)

  const size = useWindowDimensions()

  const goToGithub = () =>{ 
    window.location.href = 'https://github.com/Reservant-inc';
  }
  const goToPlayStore = () =>{ 
    window.location.href = 'https://play.google.com/store/apps/details?id=com.reservant.reservant_mobile';
  }


  return (
    <div className="flex h-full w-full items-center dark:bg-black">
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
              RESERVANT - PUBLIC DEMO
            </h1>
          )}
          <Button className="px-2 text-grey-2" onClick={goToGithub}>
            <GitHubIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
          </Button>
          <Button className="px-2 text-grey-2" onClick={goToPlayStore}>
            <ShopIcon className="h-[25px] w-[25px] text-grey-2 hover:cursor-pointer" />
          </Button>
        </div>

        <Sections />

        <div className="flex h-full flex-1 items-center justify-end gap-3">
          <SearchBar isCustomerService={false} />
          <Threads />
          <Notifications />
          <Tools />
        </div>
      </div>
    </div>
  )
}

export default NavBar
