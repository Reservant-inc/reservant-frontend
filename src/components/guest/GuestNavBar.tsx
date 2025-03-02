import React, { useState } from 'react'
import LogoSecondary from '../../assets/images/LOGO-SECONDARY.png'
import LogoPrimary from '../../assets/images/LOGO-PRIMARY.png'
import useWindowDimensions from '../../hooks/useWindowResize'
import { useNavigate } from 'react-router-dom'

const GuestNavBar: React.FC = () => {
  const [isDark, setIsDark] = useState(localStorage.theme === 'dark')

  const navigate = useNavigate()

  const size = useWindowDimensions()

  return (
    <div className="flex h-full w-full items-center shadow-md dark:bg-black">
      <div className="mx-1 flex h-full w-full items-between p-1">
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
              RESERVANT - test
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
          id='register-guest-navbar'
            className="h-fit flex items-center justify-center gap-1  px-4 border-[1px] rounded-lg p-1 border-primary dark:border-secondary text-white dark:text-dark bg-primary dark:bg-secondary"
            onClick={() => navigate('/register')}
          >
            REGISTER
          </button>
          <button
            id='login-guest-navbar'
            className="h-fit flex items-center justify-center gap-1  px-4 border-[1px] rounded-lg p-1 border-primary dark:border-secondary text-white dark:text-dark bg-primary dark:bg-secondary"
            onClick={() => navigate('/login')}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuestNavBar
