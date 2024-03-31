import { useLocation } from "react-router-dom";
import React from "react";
import NavBar from "../components/navigation/navbar/NavBar";
import { AuthWrapper } from "../components/auth/AuthWrapper";
import Footer from "../components/navigation/navbar/Footer";



const App = () => {

  const location = useLocation();

  const showNavBar = !["/user/login", "/user/register"].includes(location.pathname);

  return (
      <div className="App">
        {showNavBar && <NavBar />}
        <div className="flex flex-col items-center bg-l-grey h-screen">
          <AuthWrapper />
        </div>
        <Footer />
      </div>  
    )
}

export default App