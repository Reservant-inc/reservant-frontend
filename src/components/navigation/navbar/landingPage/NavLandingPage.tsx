import React from "react";
import Logo from "../../../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

export default function NavLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-2 flex flex-row justify-between">
      <div className="flex items-center justify-center">
        <img src={Logo} alt="logo" className="h-20" />
        <h1 className="font-regular font-mont text-xl text-d-purple">
          RESERVANT
        </h1>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="rounded-lg bg-gradient-to-br hover:bg-gradient-to-br from-d-purple via-blue to-blue px-3 py-1 font-mont text-lg transition ease-in hover:scale-105 text-cream hover:from-l-purple hover:via-pink hover:to-pink"
          onClick={() => navigate("/user/login")}
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}
