import LandingPage from "../LandingPage";
import Login from "../Login";
import RestaurantRegister from "../register/restaurantRegister/RestaurantRegister";
import React from "react";
import Register from "../register/UserRegister";
import HomePage from "../HomePage";
import RestaurantView from "../restaurant/view/RestaurantView";
import RestaurantManager from "../restaurantManagement/RestaurantManager";

export const nav = [
  { path: "/", element: <LandingPage />, isPrivate: false, roles: [""] },
  { path: "/user/login", element: <Login />, isPrivate: false, roles: [""] },
  {
    path: "/user/register",
    element: <Register />,
    isPrivate: false,
    roles: [""],
  },
  {
    path: "/restaurant/register",
    element: <RestaurantRegister />,
    isPrivate: true,
    roles: ["Customer", "RestaurantOwner"],
  },
  {
    // do testowania
    // HomePage element
    path: "/home",
    element: <RestaurantView />,
    isPrivate: true,
    roles: ["Customer", "RestaurantOwner"],
  },
  {
    path: "/:user/restaurants",
    element: <RestaurantManager />,
    isPrivate: true,
    roles: ["RestaurantOwner"],
  },
];
