import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/routeComponents/ProtectedRoute";
import React from "react";
import Home from "../components/landingPage/Home";
import Register from "../components/auth/register/Register";
import Login from "../components/auth/login/Login";
import NotFound from "../components/routeComponents/NotFound";
import RestaurantRegister from "../components/restaurant/register/RestaurantRegister";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateStatus = () => {
    setIsLoggedIn((prev) => !prev);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login updateStatus={updateStatus} />}
          />
          <Route
            path="/register"
            element={<Register updateStatus={updateStatus}/>}
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
