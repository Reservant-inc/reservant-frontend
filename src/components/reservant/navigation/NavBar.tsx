import React, { useState } from 'react'
import LogoSecondary from '../../../assets/images/LOGO-SECONDARY.png'
import LogoPrimary from '../../../assets/images/LOGO-PRIMARY.png'
import Sections from './navItems/MenuSections'
import Tools from './navItems/Tools'
import Notifications from './navItems/Notifications/Notifications'
import Threads from './navItems/Threads/Threads'
import useWindowDimensions from '../../../hooks/useWindowResize'
import UserSearchBar from './navItems/Friends/UserSearchBar'

const NavBar: React.FC = () => {
  const [isDark, setIsDark] = useState(localStorage.theme === 'dark')

  const size = useWindowDimensions()

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
              RESERVANT
            </h1>
          )}
        </div>

        <Sections />

        <div className="flex h-full flex-1 items-center justify-end gap-3">
          <UserSearchBar isCustomerService={false} />
          <Threads />
          <Notifications isDark={isDark} />
          <Tools setIsDark={setIsDark} />
        </div>
      </div>
    </div>
  )
}

export default NavBar
