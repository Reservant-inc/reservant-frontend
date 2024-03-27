import React from "react";
import Logo from "../../../assets/images/logo.png"

export default function NavLandingPage() {
    return (
        <div className="flex flex-row justify-between">
            <div className="flex justify-center items-center">
                <img src={Logo} alt="logo" className="h-20"/>
                <h1 className="font-mont">RESERVANT</h1>
            </div>
            <div>

            </div>
            <div>

            </div>
        </div>
    )
}