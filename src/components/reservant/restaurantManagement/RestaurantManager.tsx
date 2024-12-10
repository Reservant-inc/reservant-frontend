import React from 'react'
import Menu from './tabs/ManagementTabs'
import { Outlet } from 'react-router-dom'

const RestaurantManager = () => {
  return (
    <div className="flex h-full w-full bg-grey-1 bg-grey-1 dark:bg-grey-6">
      <div className="z-[0] flex w-full flex-col">
        <div className="flex h-full w-full flex-col gap-6 p-6">
          <div className="flex h-full w-full flex-col">
            <div className="flex ">
              <div className="dark:bg-grey-7  flex w-full flex-col gap-2">
                <Menu />
              </div>
            </div>
            <div className="h-[90%] w-full rounded-b-lg rounded-tr-lg shadow-md">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantManager
