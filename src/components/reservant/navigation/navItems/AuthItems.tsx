import React, { useState } from 'react'
import OutsideClickHandler from '../../../reusableComponents/OutsideClickHandler'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const AuthItems: React.FC = () => {
  const navigate = useNavigate()

  const [t] = useTranslation('global')

  const [isPressed, setIsPressed] = useState<boolean>(false)

  const pressHandler = () => {
    setIsPressed(!isPressed)
  }

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <button
        id="AuthItemsHamburgerButton"
        className="hover:bg-l-grey flex h-10 w-10 items-center justify-center rounded-full"
        onClick={pressHandler}
      >
        <div className="flex h-5 w-5 flex-col items-center justify-center gap-[6px]">
          <span className="bg-grey h-[2px] w-5 rounded" />
          <span className="bg-grey h-[2px] w-5 rounded" />
          <span className="bg-grey h-[2px] w-5 rounded" />
        </div>
      </button>
      {isPressed && (
        <div className="bg-cream absolute right-[0.5rem] top-[5rem] flex h-28 w-48 flex-col items-center justify-around rounded-2xl drop-shadow-xl">
          <button
            id="AuthItemsLoginButton"
            className="bg-l-grey hover:bg-blue hover:text-cream h-10 w-40 rounded-full p-1 transition"
            onClick={() => navigate('/user/login')}
          >
            {t('landing-page.loginButton')}
          </button>
          <button
            id="AuthItemsRegisterButton"
            className="bg-l-grey hover:bg-blue hover:text-cream h-10 w-40 rounded-full p-1 transition"
            onClick={() => navigate('/user/register')}
          >
            {t('landing-page.registerButton')}
          </button>
        </div>
      )}
    </OutsideClickHandler>
  )
}

export default AuthItems
