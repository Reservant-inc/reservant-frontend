import React, {MouseEventHandler, useState} from "react";
import Logo from "../../../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import LanguageChange from "../navItems/LanguageChange";
import AuthItems from "../navItems/AuthItems";

interface spinnerProps{
  spin: ()=>void,
}

export default function NavLandingPage({spin}:spinnerProps) {
  const navigate = useNavigate();

  return (
    <div className={"h-full"}>
      <div className="mx-4 flex flex-row justify-between h-full">
        <div className={`theme theme--${localStorage.getItem("theme")} flex items-center justify-center`}>
          <img src={Logo} alt="logo" className="h-12" />
          <label onClick={spin} className={`${localStorage.getItem("theme") === "spinner" ? "animate-spin" : ""} font-regular font-mont text-xl text-d-purple mx-2`}>
            {localStorage.getItem("theme") === "spinner"?"SEKUDE":"RESERVANT"}
          </label>
        </div>
        <div className="flex items-center justify-center gap-3">

          <LanguageChange />
          <AuthItems />

        </div>
      </div>
    </div>
  );
}
