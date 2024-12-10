import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './nav/NavBar'

const CustomerService: React.FC = () => {
  return (
    <div className="w-full h-full bg-grey-1 dark:bg-grey-5 flex flex-col">
      <div className="w-full h-[3.5rem] bg-white">
        <NavBar />
      </div>
      <div className="h-[calc(100%-3.5rem)] w-full">
        <div className="w-64 h-full p-2">
          <div className="2-full h-full bg-white dark:bg-black rounded-lg shadow-lg"></div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default CustomerService
