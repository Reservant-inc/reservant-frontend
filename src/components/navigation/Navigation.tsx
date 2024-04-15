import LandingPage from "../landingPage/LandingPage"
import Login from "../auth/login/Login"
import RestaurantRegister from "../restaurant/register/RestaurantRegister"
import React from "react"
import Register from "../auth/register/Register"
import HomePage from "../HomePage"
import RestaurantManager from "../restaurant/management/RestaurantManager"

export const nav = [
     { path:     "/",                       element: <LandingPage />,          isPrivate: false,         roles: [""]                             },
     { path:     "/user/login",             element: <Login />,                isPrivate: false,         roles: [""]                             },
     { path:     "/user/register",          element: <Register />,             isPrivate: false,         roles: [""]                             },
     { path:     "/restaurant/register",    element: <RestaurantRegister />,   isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/home",                   element: <HomePage />,             isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/:user/restaurant",       element: <HomePage />,             isPrivate: true,          roles: ["RestaurantOwner"]              },
     {path:      "/restaurant/manage",      element: <RestaurantManager />,     isPrivate: false,         roles: ["RestaurantOwner"]              },
]