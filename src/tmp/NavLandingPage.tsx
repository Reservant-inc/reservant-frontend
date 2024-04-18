import React from "react";
import Logo from "../../../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import LanguageChange from "../components/navigation/navItems/LanguageChange";
import AuthItems from "../components/navigation/navItems/AuthItems";
import ThemeButton from "../components/navigation/navItems/ThemeButton"

export default function NavLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full">
      <div className="mx-4 flex flex-row justify-between h-full">
        <div className="flex items-center justify-center">
          <img src={Logo} alt="logo" className="h-12 hover:animate-spin" />
          <h1 className="font-regular font-mont text-xl text-d-purple mx-2 hover:animate-spin">
            RESERVANT
          </h1>
        </div>
        <div className="flex items-center justify-center gap-3">

          <ThemeButton/>
          <LanguageChange />
          <AuthItems />

        </div>
      </div>
    </div>
  );
}
