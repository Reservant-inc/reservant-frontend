import LandingPage from "../landingPage/LandingPage"
import Login from "../auth/login/Login"
import RestaurantRegister from "../restaurant/register/RestaurantRegister"
import EmployeeRegister from "../auth/EmployeeRegister/EmployeeRegister"
import React from "react"
import Register from "../auth/register/Register"
import HomePage from "../HomePage"

export const nav = [
     { path:     "/",                       element: <LandingPage />,          isPrivate: false  },
     { path:     "/user/login",             element: <Login />,                isPrivate: false  },
     { path:     "/user/register",          element: <Register />,             isPrivate: false  },
     { path:     "/restaurant/register",    element: <RestaurantRegister />,   isPrivate: true   },
     { path:     "/home",                   element: <HomePage />,             isPrivate: true   },
     {path: "/addEmp", element: <EmployeeRegister/>, isPrivate: false}
]