import React from 'react'
import GuestNavBar from './GuestNavBar'
import GuestHomePage from './GuestHomePage'

const LandingPage: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="h-[3.5rem] shadow-md flex">
        <GuestNavBar />
      </div>
      <div className="h-[calc(100%-3.5rem)]">
        <GuestHomePage />
      </div>
    </div>
  )
}

export default LandingPage
