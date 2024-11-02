import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import UserRegister from "../components/SignInSignUp/UserRegister";
import HomePage from "../components/HomePage";
import { checkAuthLoader, redirectIfLoggedIn } from "../services/auth";
import Root from "../components/ProtectedLayout";
import Login from "../components/SignInSignUp/Login";
import RestaurantManager from "../components/restaurantManagement/RestaurantManager";
import Profile from "../components/profile/Profile";
import Dashboard from "../components/restaurantManagement/dashboard/Dashboard";
import EmployeeManagement from "../components/restaurantManagement/employees/EmployeeManagement";
import RestaurantListSection from "../components/restaurantManagement/restaurants/restaurantsList/RestaurantListSection";
import EmployeeRestaurantManagement from "../components/restaurantManagement/employees/EmployeeRestaurantManagement";
import Menu from "../components/restaurantManagement/menus/Menu";
import IngredientTable from "../components/restaurantManagement/Warehouse/IngredientTable";
import HistoryTab from "../components/restaurantManagement/reservations/HistoryTab";
import MenuList from "../components/restaurantManagement/menus/MenuList";
import { MenuScreenType } from "../services/enums";

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
        path: "home",
        element: <HomePage />,
      },
      {
        path: ":name/management",
        element: <RestaurantManager />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "employee-management",
            element: <EmployeeManagement />,
          },
          {
            path: "restaurants",
            element: <RestaurantListSection />,
          },
          {
            path: "restaurant/:restaurantId",
            children: [
              {
                path: "restaurant-dashboard",
                element: <Dashboard />,
              },
              {
                path: "restaurant-employee-management",
                element: <EmployeeRestaurantManagement />,
              },
              {
                path: "menu-management",
                element: <MenuList type={MenuScreenType.Management} />,
              },
              {
                path: "warehouse-management",
                element: <IngredientTable />,
              },
              {
                path: "reservation-history",
                element: <HistoryTab />,
              },
            ],
          },
        ],
      },
      {
        path: "profile",
        element: <Profile />,
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
