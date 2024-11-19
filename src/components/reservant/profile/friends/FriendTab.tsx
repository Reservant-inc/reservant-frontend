import React from 'react'
import { Outlet } from 'react-router-dom'
import FriendsListTabs from './FriendsListTabs'
import { useTranslation } from 'react-i18next'

const FriendTab: React.FC = () => {

    const [t] = useTranslation('global')

  return (
    <div className="flex flex-col bg-white rounded-lg w-full h-full p-4 gap-4 shadow-md dark:bg-black">
      <div className="flex h-[2rem] justify-between items-center">
        <h1 className="font-mont-bd text-lg dark:text-white">{t('profile.friends.friends-tab')}</h1>
        <FriendsListTabs />
      </div>
      <div className="w-full h-[calc(100%-3rem)]">
        <Outlet />
      </div>
    </div>
  )
}

export default FriendTab
