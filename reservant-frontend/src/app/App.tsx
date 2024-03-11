import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/routeComponents/ProtectedRoute";
import "./App.css";
import React from "react";
import Home from "../components/landingPage/Home";
import Login from "../components/login/Login";

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
            element={<Register updateStatus={updateStatus} />}
          />
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}></Route>
          <Route path="*" element={} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
