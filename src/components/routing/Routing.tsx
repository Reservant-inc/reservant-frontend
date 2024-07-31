import LandingPage from "../LandingPage";
import Login from "../SignInSignUp/Login";
import RestaurantRegister from "../register/restaurantRegister/RestaurantRegister";
import React from "react";
import UserRegister from "../SignInSignUp/UserRegister";
import HomePage from "../HomePage";
import RestaurantManager from "../restaurantManagement/RestaurantManager";
import RestaurantView from "../restaurant/view/RestaurantPageView/RestaurantView";

export const nav = [
  { path: "/", element: <LandingPage />, isPrivate: false, roles: [""] },
  { path: "/user/login", element: <Login />, isPrivate: false, roles: [""] },
  {
    path: "/user/register",
    element: <UserRegister />,
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
    // do testowania RestaurantView
    // HomePage element
    path: "/home",
    element: <HomePage />,
    isPrivate: true,
    roles: ["Customer", "RestaurantOwner", "RestaurantEmployee"],
  },
  {
    path: "/:user/restaurants",
    element: <RestaurantManager />,
    isPrivate: true,
    roles: ["RestaurantOwner"],
  },
  {
    path: "/restaurants/:id",
    element: <RestaurantView />,
    isPrivate: true,
    roles: ["RestaurantOwner", "Customer", "RestaurantEmployee"],
  },
];
