import React from "react";
import Logo from "../assets/images/logo.png";
import LanguageChange from "../components/navigation/navItems/LanguageChange";
import AuthItems from "../components/navigation/navItems/AuthItems";

export default function NavLandingPage() {
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

          <LanguageChange />
          <AuthItems />

        </div>
      </div>
    </div>
  );
}
