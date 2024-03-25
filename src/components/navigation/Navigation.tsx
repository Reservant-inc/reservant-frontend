import LandingPage from "../landingPage/LandingPage"
import Login from "../auth/login/Login"
import RestaurantRegister from "../restaurant/register/RestaurantRegister"
import React from "react"
import Home from "../Home"

export const nav = [
     { path:     "/",                       element: <LandingPage />,          isPrivate: false  },
     { path:     "/auth/login",             element: <Login />,                isPrivate: false  },
     { path:     "/auth/register",          element: <RestaurantRegister />,   isPrivate: false  },
     { path:     "/restaurant/register",    element: <RestaurantRegister />,   isPrivate: true   },
     { path:     "/home",                   element: <Home />,                 isPrivate: true   },
]