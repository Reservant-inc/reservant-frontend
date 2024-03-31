import React from "react"
import { useLocation } from "react-router"
import NavLandingPage from "./landingPage/NavLandingPage"
import NavHome from "./home/NavHome"

const NavBar = () => {
    const location = useLocation()

    const isLandingPage = location.pathname === "/"

    return (
        <div className="h-20 w-full bg-cream">
            {isLandingPage ? <NavLandingPage /> : <NavHome />}
        </div>
    )
}

export default NavBar