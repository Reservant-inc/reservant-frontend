import React from 'react'
import { Outlet } from 'react-router-dom'
import FriendsListTabs from './FriendsListTabs'
import { useTranslation } from 'react-i18next'

const FriendTab: React.FC = () => {
  const [t] = useTranslation('global')

  return (
    <div className="flex flex-col rounded-lg w-full h-full">
      <div className="flex justify-between items-center dark:text-grey-1">
        <div className="px-2">
          <h1 className="text-lg font-mont-bd">Friends</h1>
        </div>
        <FriendsListTabs />
      </div>
      <div className="w-full h-[calc(100%-3rem)] bg-white dark:bg-black rounded-lg rounded-tr-none shadow-md p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default FriendTab
