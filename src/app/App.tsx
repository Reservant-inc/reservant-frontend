import { useLocation } from "react-router-dom";
import React, {useEffect, useState} from "react";

import NavBar from "../components/navigation/NavBar";
import { AuthWrapper } from "../components/routing/AuthWrapper";
import Footer from "../components/navigation/Footer";





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