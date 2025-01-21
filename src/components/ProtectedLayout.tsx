import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './reservant/navigation/NavBar'
import ThreadContextProvider from '../contexts/ThreadContext'
import ThemeContextProvider from '../contexts/ThemeContext'
import{ SnackbarProvider} from '../contexts/SnackbarContext'

const ProtectedLayout = () => {
  return (
    <div className="relative h-full w-full">
      <SnackbarProvider>
        <ThreadContextProvider>
          <ThemeContextProvider>
            <div className="h-[3.5rem] shadow-md flex">
              <NavBar />
            </div>
            <div className="h-[calc(100%-3.5rem)]">
              <Outlet />
            </div>
          </ThemeContextProvider>
        </ThreadContextProvider>
      </SnackbarProvider>
    </div>
  )
}

export default ProtectedLayout
