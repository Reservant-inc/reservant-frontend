import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserRegister from '../components/auth/UserRegister'
import {
  checkAuthLoader,
  checkIfCustomerService,
  checkIfOwner,
  redirectIfLoggedIn
} from '../components/auth/auth'
import Root from '../components/ProtectedLayout'
import Login from '../components/auth/Login'
import RestaurantManager from '../components/reservant/restaurantManagement/RestaurantManager'
import Profile from '../components/reservant/profile/Profile'
import Dashboard from '../components/reservant/restaurantManagement/dashboard/Dashboard'
import EmployeeManagement from '../components/reservant/restaurantManagement/employees/EmployeeManagement'
import RestaurantListSection from '../components/reservant/restaurantManagement/restaurants/restaurantsList/RestaurantListSection'
import EmployeeRestaurantManagement from '../components/reservant/restaurantManagement/employees/EmployeeRestaurantManagement'
import IngredientTable from '../components/reservant/restaurantManagement/Warehouse/IngredientTable'
import HistoryTab from '../components/reservant/restaurantManagement/reservations/HistoryTab'
import MenuList from '../components/reservant/restaurantManagement/menus/MenuList'
import {
  EventListType,
  MenuScreenType,
  ReservationListType
} from '../services/enums'
import Account from '../components/reservant/profile/Account'
import Checkout from '../components/reservant/restaurant/Checkout'
import VisitWrapper from '../components/reservant/restaurant/visits/VisitRoot'
import Visit from '../components/reservant/restaurant/visits/Visit'
import ReviewsManagement from '../components/reservant/restaurantManagement/ReviewsMenagment'
import NotFound from '../components/NotFound'
import FriendsManagement from '../components/reservant/profile/FriendsManagement'
import EventTab from '../components/reservant/profile/events/EventTab'
import EventList from '../components/reservant/profile/events/EventList'
import Feed from '../components/reservant/feed/Feed'
import CustomerService from '../components/customerService/CustomerService'
import HomePage from '../components/reservant/HomePage'
import LandingPage from '../components/guest/LandingPage'
import ReservationHistoryTab from '../components/reservant/profile/reservations/ReservationHistoryTab'
import ReservationList from '../components/reservant/profile/reservations/ReservationList'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    loader: redirectIfLoggedIn
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
            element: <ReservationHistoryTab />,
            children: [
              {
                path: 'incoming',
                element: (
                  <ReservationList listType={ReservationListType.Incoming} />
                )
              },
              {
                path: 'finished',
                element: (
                  <ReservationList listType={ReservationListType.Finished} />
                )
              }
            ]
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
    path: 'customer-service',
    element: <CustomerService />,
    loader: checkIfCustomerService
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
