import { useLocation } from "react-router-dom";
import React, {useEffect, useState} from "react";

import NavBar from "../components/navigation/navbar/NavBar";
import { AuthWrapper } from "../components/auth/AuthWrapper";
import Footer from "../components/navigation/navbar/Footer";





const App = () => {

  const location = useLocation();

  const showNavBar = !["/user/login", "/user/register"].includes(location.pathname);

  //sets theme as os preffered or chosen by user on page load

  useEffect(()=>{
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })
  
  return (

      <div className="App">
        {showNavBar && <NavBar />}
        {/* dark do wywalenia, potrzebne do testow */}
        <div className="flex flex-col items-center bg-l-grey h-screen dark:bg-black">
          <AuthWrapper />
        </div>
        <Footer />
      </div>  
    )

}

export default App