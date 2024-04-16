import LandingPage from "../landingPage/LandingPage"
import Login from "../auth/login/Login"
import RestaurantRegister from "../restaurant/register/RestaurantRegister"
import AddEmployee from "../restaurant/RestaurantAddEmp"
import React from "react"
import Register from "../auth/register/Register"
import HomePage from "../HomePage"

export const nav = [

    

     { path:     "/",                       element: <LandingPage />,          isPrivate: false,         roles: [""]                             },
     { path:     "/user/login",             element: <Login />,                isPrivate: false,         roles: [""]                             },
     { path:     "/user/register",          element: <Register />,             isPrivate: false,         roles: [""]                             },
     { path:     "/restaurant/register",    element: <RestaurantRegister />,   isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/home",                   element: <HomePage />,             isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/:user/restaurant",       element: <HomePage />,             isPrivate: true,          roles: ["RestaurantOwner"]              },
     {path: "/addEmp", element: <AddEmployee/>, isPrivate: false}
]