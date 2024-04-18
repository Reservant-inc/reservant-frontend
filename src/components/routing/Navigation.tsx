import LandingPage from "../../tmp/landingPage/LandingPage"
import Login from "../Login"
import RestaurantRegister from "../register/RestaurantRegister"
import AddEmployee from "../../tmp/restaurant/RestaurantAddEmp"
import EmployeeRegister from "../register/EmployeeRegister"
import React from "react"
import Register from "../register/UserRegister"
import HomePage from "../../tmp/HomePage"
import RestaurantManager from "../management/RestaurantManagement/RestaurantManager"

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