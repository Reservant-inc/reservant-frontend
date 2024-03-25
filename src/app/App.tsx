import { useLocation } from "react-router-dom";
import React from "react";
import NavBar from "../components/navigation/NavBar";
import { AuthWrapper } from "../components/auth/AuthWrapper";



const App = () => {

  const location = useLocation();

  const showNavBar = !["/login", "/register"].includes(location.pathname);

  return (
      <div className="App">
        {showNavBar && <NavBar />}
        <AuthWrapper />
      </div>  
    )
}

export default App