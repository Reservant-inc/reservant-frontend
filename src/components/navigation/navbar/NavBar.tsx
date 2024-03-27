import React, { useEffect, useState } from "react"
import { useLocation } from "react-router"
import NavLandingPage from "./NavLandingPage"
import NavHome from "./NavHome"

const NavBar = () => {
    const location = useLocation()

    const isLandingPage = location.pathname === "/"

    return (
        <div className="h-20 w-full bg-blue">
            {isLandingPage ? <NavLandingPage /> : <NavHome />}
        </div>
    )
}

export default NavBar