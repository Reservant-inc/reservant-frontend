import LandingPage from "../landingPage/LandingPage"
import Login from "../auth/login/Login"
import RestaurantRegister from "../restaurant/register/RestaurantRegister"
import EmployeeRegister from "../auth/EmployeeRegister/EmployeeRegister"
import React from "react"
import Register from "../auth/register/Register"
import HomePage from "../HomePage"
import RestaurantManager from "../restaurant/management/RestaurantManager"
import EmployeeRegister from "../restaurant/EmployeeRegister/EmployeeRegister"

export const nav = [
     { path:     "/",                       element: <LandingPage />,          isPrivate: false,         roles: [""]                             },
     { path:     "/user/login",             element: <Login />,                isPrivate: false,         roles: [""]                             },
     { path:     "/user/register",          element: <Register />,             isPrivate: false,         roles: [""]                             },
     { path:     "/restaurant/register",    element: <RestaurantRegister />,   isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/home",                   element: <HomePage />,             isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/:user/restaurants",      element: <RestaurantManager />,    isPrivate: true,          roles: ["RestaurantOwner"]              },
     { path:     "/emp",                    element: <EmployeeRegister/>,      isPrivate: true,          roles: ["RestaurantOwner"]              }
     { path:     "/",                       element: <LandingPage />,          isPrivate: false  },
     { path:     "/user/login",             element: <Login />,                isPrivate: false  },
     { path:     "/user/register",          element: <Register />,             isPrivate: false  },
     { path:     "/restaurant/register",    element: <RestaurantRegister />,   isPrivate: true   },
     { path:     "/home",                   element: <HomePage />,             isPrivate: true   },
     {path: "/addEmp", element: <EmployeeRegister/>, isPrivate: false}
]