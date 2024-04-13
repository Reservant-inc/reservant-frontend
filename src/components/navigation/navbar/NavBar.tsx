import React from "react"
import { useLocation } from "react-router"
import NavLandingPage from "./landingPage/NavLandingPage"
import NavHome from "./home/NavHome"



interface spinnerProps{
    spin: ()=>void
  }
  
const NavBar = ({spin}:spinnerProps) => {
    const location = useLocation()

    const isLandingPage = location.pathname === "/"

    return (
        <div className="h-[4.5rem] w-full bg-cream relative shadow-md">
            {isLandingPage ? <NavLandingPage spin={spin}/> : <NavHome />}
        </div>
    )
}

export default NavBar