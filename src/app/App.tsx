import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "../components/routeComponents/ProtectedRoute";
import React from "react";
import LandingPage from "../components/landingPage/LandingPage";
import Register from "../components/auth/register/Register";
import Login from "../components/auth/login/Login";
import NotFound from "../components/routeComponents/NotFound";
import RestaurantRegister from "../components/restaurant/register/RestaurantRegister";
import NavBar from "../components/navigation/NavBar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateStatus = () => {
    setIsLoggedIn((prev) => !prev);
  };

  const location = useLocation();

  const showNavBar = !["/login", "/register"].includes(location.pathname);

  return (
    <div className="App">
       {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/auth">
          <Route path="login"  element={<Login updateStatus={updateStatus} />} />
          <Route path="register" element={<Register/>} />
        </Route>

        <Route path="/reservant">
          <Route path="restaurant">
            <Route path="register" element={<RestaurantRegister/>}  />
          </Route>
        </Route>

        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
