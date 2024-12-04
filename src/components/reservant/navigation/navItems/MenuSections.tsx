import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import StorefrontSharpIcon from '@mui/icons-material/StorefrontSharp'
import HomeIcon from '@mui/icons-material/Home'
import CelebrationSharpIcon from '@mui/icons-material/CelebrationSharp'

interface SectionProps {}

const Sections: React.FC<SectionProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const userInfo = Cookies.get('userInfo')
  if (!userInfo) {
    return null
  }

  const user = JSON.parse(userInfo)

  const userRoles = user.roles

  const isClickedRestaurants = location.pathname.startsWith(
    `/reservant/${user.firstName}-${user.lastName}/management`
  )
  const isClickedHome = location.pathname.startsWith('/reservant/home')
  const isClickedEvents = location.pathname === '/reservant/events'

  return (
    <div className="flex h-full items-center gap-3">
      <div className="relative h-14">
        <button
          id="NavbarHomeSectionButton"
          className={
            'relative mt-1 flex h-12 w-28 flex-col items-center justify-between rounded-xl text-grey-2' +
            (isClickedHome
              ? ' hover:bg-transpartent text-primary dark:text-secondary dark:hover:bg-none'
              : ' hover:bg-grey-1 dark:hover:bg-grey-5')
          }
          onClick={() => navigate('home')}
        >
          <HomeIcon className="absolute top-1/2 h-6 -translate-y-1/2 transform h-8 w-8" />
        </button>
        {isClickedHome && (
          <span className="absolute bottom-0 h-[3px] w-full scale-y-100 transform bg-primary transition dark:bg-secondary" />
        )}
      </div>
      <div className="relative h-14">
        <button
          id="NavbarEventsButton"
          className={
            'relative mt-1 flex h-12 w-28 flex-col items-center justify-between rounded-xl text-grey-2' +
            (isClickedEvents
              ? ' hover:bg-transpartent text-primary dark:text-secondary dark:hover:bg-none'
              : ' hover:bg-grey-1 dark:hover:bg-grey-5')
          }
          onClick={() => navigate('events')}
        >
          <CelebrationSharpIcon className="absolute top-1/2 h-6 -translate-y-1/2 transform h-8 w-8" />
        </button>
        {isClickedEvents && (
          <span className="absolute bottom-0 h-[3px] w-full scale-y-100 transform bg-primary transition dark:bg-secondary" />
        )}
      </div>
      {userRoles.includes('RestaurantOwner') && (
        <div className="relative h-14">
          <button
            id="NavbarRestaurantsSectionButton"
            className={
              'relative mt-1 flex h-12 w-28 flex-col items-center justify-between rounded-xl text-grey-2' +
              (isClickedRestaurants
                ? ' hover:bg-transpartent text-primary dark:text-secondary dark:hover:bg-none'
                : ' hover:bg-grey-1 dark:hover:bg-grey-5')
            }
            onClick={() =>
              navigate(
                `${user.firstName + '-' + user.lastName}/management/dashboard`
              )
            }
          >
            <StorefrontSharpIcon className="absolute top-1/2 h-6 -translate-y-1/2 transform h-7 w-7" />
          </button>
          {isClickedRestaurants && (
            <span className="absolute bottom-0 h-[3px] w-full scale-y-100 transform bg-primary transition dark:bg-secondary" />
          )}
        </div>
      )}
    </div>
  )
}

export default Sections
