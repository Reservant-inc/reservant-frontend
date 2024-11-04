import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./navigation/NavBar";

const ProtectedLayout = () => {
  return (
    <>
      <div className="h-[55px]">
        <NavBar />
      </div>
      <div className="h-[calc(100%-3.5rem)]">
        <Outlet />
      </div>
    </>
  );
};

export default ProtectedLayout;
