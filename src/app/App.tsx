import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import UserRegister from "../components/SignInSignUp/UserRegister";
import HomePage from "../components/HomePage";
import { checkAuthLoader, redirectIfLoggedIn } from "../services/auth";
import Root from "../components/ProtectedLayout";
import Login from "../components/SignInSignUp/Login";
import RestaurantManager from "../components/restaurantManagement/RestaurantManager";
import Visit from "../components/restaurant/visits/Visit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "reservant",
    element: <Root />,
    loader: checkAuthLoader,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "management",
        element: <RestaurantManager />,
        children: [{}],
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
    loader: redirectIfLoggedIn,
  },
  {
    path: "register",
    element: <UserRegister />,
    loader: redirectIfLoggedIn,
  },
]);

const App = () => {
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div id="AppWrapper" className="App font-mont-md">
      <div id="AppMainSection" className="h-screen">
        <RouterProvider router={router} />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
