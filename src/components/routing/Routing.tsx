import LandingPage from "../LandingPage"
import Login from "../Login"
import RestaurantRegister from "../register/restaurantRegister/RestaurantRegister"
import React from "react"
import Register from "../register/UserRegister"
import HomePage from "../HomePage"
import RestaurantManager from "../management/RestaurantManagement/RestaurantManager"
import ComplaintForm from "../../ComplaintForm"

export const nav = [
     { path:     "/",                       element: <LandingPage />,          isPrivate: false,         roles: [""]                             },
     { path:     "/user/login",             element: <Login />,                isPrivate: false,         roles: [""]                             },
     { path:     "/user/register",          element: <Register />,             isPrivate: false,         roles: [""]                             },
     { path:     "/restaurant/register",    element: <RestaurantRegister />,   isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/home",                   element: <HomePage />,             isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/:user/restaurants",      element: <RestaurantManager />,    isPrivate: true,          roles: ["RestaurantOwner"]              },
     { path:     "/complaint",      element: <ComplaintForm />,    isPrivate: true,          roles: ["Customer"]              },
]