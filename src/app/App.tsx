import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from '../components/LandingPage'
import UserRegister from '../components/auth/UserRegister'
import HomePage from '../components/HomePage'
import {
  checkAuthLoader,
  checkIfOwner,
  redirectIfLoggedIn
} from '../components/auth/auth'
import Root from '../components/ProtectedLayout'
import Login from '../components/auth/Login'
import RestaurantManager from '../components/restaurantManagement/RestaurantManager'
import Profile from '../components/profile/Profile'
import Dashboard from '../components/restaurantManagement/dashboard/Dashboard'
import EmployeeManagement from '../components/restaurantManagement/employees/EmployeeManagement'
import RestaurantListSection from '../components/restaurantManagement/restaurants/restaurantsList/RestaurantListSection'
import EmployeeRestaurantManagement from '../components/restaurantManagement/employees/EmployeeRestaurantManagement'
import IngredientTable from '../components/restaurantManagement/Warehouse/IngredientTable'
import HistoryTab from '../components/restaurantManagement/reservations/HistoryTab'
import MenuList from '../components/restaurantManagement/menus/MenuList'
import { EventListType, MenuScreenType } from '../services/enums'
import Account from '../components/profile/Account'
import ReservationHistory from '../components/profile/ReservationHistory'
import EventHistory from '../components/profile/EventHistory'
import Checkout from '../components/restaurant/Checkout'
import VisitWrapper from '../components/restaurant/visits/VisitRoot'
import Visit from '../components/restaurant/visits/Visit'
import ReviewsManagement from '../components/restaurantManagement/ReviewsMenagment'
import NotFound from '../components/NotFound'
import FriendsManagement from '../components/profile/FriendsManagement'
import EventTab from '../components/profile/events/EventTab'
import path from 'path'
import EventList from '../components/profile/events/EventList'
import Feed from '../components/feed/Feed'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: 'reservant',
    element: <Root />,
    loader: checkAuthLoader,
    children: [
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: ':name/management',
        element: <RestaurantManager />,
        loader: checkIfOwner,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'employee-management',
            element: <EmployeeManagement />
          },
          {
            path: 'restaurants',
            element: <RestaurantListSection />
          },
          {
            path: 'restaurant/:restaurantId',
            children: [
              {
                path: 'restaurant-dashboard',
                element: <Dashboard />
              },
              {
                path: 'restaurant-employee-management',
                element: <EmployeeRestaurantManagement />
              },
              {
                path: 'menu-management',
                element: <MenuList type={MenuScreenType.Management} />
              },
              {
                path: 'warehouse-management',
                element: <IngredientTable />
              },
              {
                path: 'reservation-history',
                element: <HistoryTab />
              },
              {
                path: 'reviews-management',
                element: <ReviewsManagement />
              }
            ]
          }
        ]
      },
      {
        path: 'events',
        element: <Feed />
      },
      {
        path: 'profile/:userId',
        element: <Profile />,
        children: [
          {
            path: 'account',
            element: <Account />
          },
          {
            path: 'reservation-history',
            element: <ReservationHistory />
          },
          {
            path: 'event-history',
            element: <EventTab />,
            children: [
              {
                path: 'created',
                element: <EventList listType={EventListType.Created} />
              },
              {
                path: 'interested',
                element: <EventList listType={EventListType.Interested} />
              },
              {
                path: 'participates',
                element: <EventList listType={EventListType.Participates} />
              }
            ]
          },
          {
            path: 'friends',
            element: <FriendsManagement />
          }
        ]
      },
      {
        path: 'restaurant',
        element: <VisitWrapper />,
        children: [
          {
            path: 'reservation',
            element: <Visit />
          },
          {
            path: 'checkout',
            element: <Checkout />
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    element: <Login />,
    loader: redirectIfLoggedIn
  },
  {
    path: 'register',
    element: <UserRegister />,
    loader: redirectIfLoggedIn
  },
  {
    path: '*',
    element: <NotFound />
  }
])

const App = () => {
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  return (
    <div id="AppWrapper" className="App font-mont-md">
      <div id="AppMainSection" className="h-screen">
        <RouterProvider router={router} />
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default App
