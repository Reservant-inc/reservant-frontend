import React from "react"
import { useLocation } from "react-router"
import NavLandingPage from "../../tmp/NavLandingPage"
import NavHome from "../../tmp/NavHome"

const NavBar: React.FC = () => {
    const location = useLocation()

    const isLandingPage = location.pathname === "/"

    return (
        <div className="h-[4.5rem] w-full bg-cream relative shadow-md">
            {isLandingPage ? <NavLandingPage /> : <NavHome />}
        </div>
    )
}

export default NavBar