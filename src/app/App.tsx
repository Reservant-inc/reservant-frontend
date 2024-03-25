import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/routeComponents/ProtectedRoute";
import React from "react";
import Home from "../components/landingPage/Home";
import Register from "../components/auth/register/Register";
import Login from "../components/auth/login/Login";
import NotFound from "../components/routeComponents/NotFound";
import RestaurantRegister from "../components/restaurant/register/RestaurantRegister";
import ThemeButton from "../components/ThemeButton";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateStatus = () => {
    setIsLoggedIn((prev) => !prev);
  };

  return (
    <div className="bg-white dark:bg-black dark:text-white">
      {/* temporary place for theme button */}
      <ThemeButton></ThemeButton>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login updateStatus={updateStatus} />}
          />
          <Route
            path="/register"
            element={<Register/>}
          />
          <Route path="/restaurant">
            <Route
              path="register"
              element={<RestaurantRegister/>}
            />
          </Route>
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
