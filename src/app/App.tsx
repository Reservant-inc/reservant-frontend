import { useLocation } from "react-router-dom";
import React, {useState} from "react";
import NavBar from "../components/navigation/navbar/NavBar";
import { AuthWrapper } from "../components/auth/AuthWrapper";
import Footer from "../components/navigation/navbar/Footer";

const App = () => {

  const location = useLocation();

  const showNavBar = !["/user/login", "/user/register"].includes(location.pathname);

  const[isSpinning, setIsSpinning] = useState<string>("");

  function spin() {
    if(!(localStorage.theme=="spinner"))
      {
        localStorage.theme = "spinner";
        setIsSpinning("spinner");
        return;
      }
    localStorage.theme = "";

    setIsSpinning("")

  }

  return (
      <div className={`App theme theme--${localStorage.getItem("theme")}`}>
          {showNavBar && <NavBar spin={spin} />}
        <div className={`${localStorage.getItem("theme") === "spinner" ? "animate-spin" : ""}`}>
          <div className="flex flex-col items-center bg-l-grey h-screen">
            <AuthWrapper />
          </div>
          <Footer />
        </div>
      </div>  
    )
}

export default App