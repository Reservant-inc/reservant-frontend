import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './nav/NavBar'

const CustomerService: React.FC = () => {
  return (
    <div className="w-full h-full bg-grey-1 dark:bg-grey-5 flex flex-col">
      <div className="w-full h-[3.5rem] bg-white">
        <NavBar />
      </div>
      <div className="flex gap-2 p-2 h-[calc(100%-3.5rem)] w-full">
        <div className="w-64 h-full">
          <div className="w-full h-full bg-white dark:bg-black rounded-lg shadow-lg"></div>
        </div>
        <div className="h-full w-[calc(100%-16rem)] rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default CustomerService
