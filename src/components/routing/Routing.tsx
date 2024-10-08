import LandingPage from "../LandingPage";
import Login from "../SignInSignUp/Login";
import RestaurantRegister from "../register/restaurantRegister/RestaurantRegister";
import React from "react";
import UserRegister from "../SignInSignUp/UserRegister";
import HomePage from "../HomePage";
import RestaurantManager from "../restaurantManagement/RestaurantManager";
import { Routing } from "../../services/types";

export const nav: Routing = [
  { path: "/",                    element: <LandingPage />,         isPrivate: false,   navbar: false,  roles: [""] },
  { path: "/user/login",          element: <Login />,               isPrivate: false,   navbar: false,  roles: [""] },
  { path: "/user/register",       element: <UserRegister />,        isPrivate: false,   navbar: false,  roles: [""],},
  { path: "/restaurant/register", element: <RestaurantRegister />,  isPrivate: true,    navbar: true,   roles: ["Customer", "RestaurantOwner"],},
  { path: "/home",                element: <HomePage />,            isPrivate: true,    navbar: true,   roles: ["Customer", "RestaurantOwner", "RestaurantEmployee"],},
  { path: "/:user/restaurants",   element: <RestaurantManager />,   isPrivate: true,    navbar: true,   roles: ["RestaurantOwner"],}
];
