import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./navigation/NavBar";

const ProtectedLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
