import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './reservant/navigation/NavBar'

const ProtectedLayout = () => {
  return (
    <div className="relative h-full w-full">
      <div className="h-[3.5rem] shadow-md flex">
        <NavBar />
      </div>
      <div className="h-[calc(100%-3.5rem)]">
        <Outlet />
      </div>
    </div>
  )
}

export default ProtectedLayout
