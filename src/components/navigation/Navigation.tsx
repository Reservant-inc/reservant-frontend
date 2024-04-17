import LandingPage from "../landingPage/LandingPage"
import Login from "../auth/login/Login"
import RestaurantRegister from "../restaurant/register/RestaurantRegister"
import AddEmployee from "../restaurant/RestaurantAddEmp"
import EmployeeRegister from "../auth/EmployeeRegister/EmployeeRegister"
import React from "react"
import Register from "../auth/register/Register"
import HomePage from "../HomePage"
import RestaurantManager from "../restaurant/management/RestaurantManager"
import RestaurantDetails from "../restaurant/management/RestaurantDetails"

export const nav = [
     { path:     "/",                       element: <LandingPage />,          isPrivate: false,         roles: [""]                             },
     { path:     "/user/login",             element: <Login />,                isPrivate: false,         roles: [""]                             },
     { path:     "/user/register",          element: <Register />,             isPrivate: false,         roles: [""]                             },
     { path:     "/restaurant/register",    element: <RestaurantRegister />,   isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/home",                   element: <HomePage />,             isPrivate: true,          roles: ["Customer", "RestaurantOwner"]  },
     { path:     "/:user/restaurants",      element: <RestaurantManager />,    isPrivate: true,          roles: ["RestaurantOwner"]              },
     { path:     "/addEmp",                 element: <AddEmployee/>,           isPrivate: true,          roles: ["RestaurantOwner"]              },
     { path:     "/emp",                    element: <EmployeeRegister/>,      isPrivate: true,          roles: ["RestaurantOwner"]              }
]