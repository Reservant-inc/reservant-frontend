import React, { useEffect } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import UserRegister from '../components/auth/UserRegister'
import {
  checkAuthLoader,
  checkIfCustomerService,
  checkIfOwner,
  logoutAction,
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
  FriendListType,
  MenuScreenType,
  ReportsListType,
  ReservationListType
} from '../services/enums'
import Account from '../components/reservant/profile/Account'
import Checkout from '../components/reservant/restaurant/Checkout'
import VisitWrapper from '../components/reservant/restaurant/visits/VisitRoot'
import Visit from '../components/reservant/restaurant/visits/Visit'
import ReviewsManagement from '../components/reservant/restaurantManagement/ReviewsMenagment'
import NotFound from '../components/NotFound'
import EventTab from '../components/reservant/profile/events/EventTab'
import EventList from '../components/reservant/profile/events/EventList'
import Feed from '../components/reservant/feed/Feed'
import CustomerService from '../components/customerService/CustomerService'
import HomePage from '../components/reservant/HomePage'
import LandingPage from '../components/guest/LandingPage'
import ReservationHistoryTab from '../components/reservant/profile/reservations/ReservationHistoryTab'
import ReservationList from '../components/reservant/profile/reservations/ReservationList'
import FriendTab from '../components/reservant/profile/friends/FriendTab'
import FriendList from '../components/reservant/profile/friends/FriendList'
import DeliveriesTable from '../components/reservant/restaurantManagement/deliveries/DeliveriesTable'
import Reports from '../components/reservant/restaurantManagement/Reports'
import ReportsTab from '../components/reservant/profile/reports/ReportsTab'
import ReportsList from '../components/reservant/profile/reports/ReportsList'
import ComplaintsList from '../components/customerService/complaints/ComplaintsList'

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
        path: 'home/:restaurantId?',
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
              },
              {
                path: 'deliveries-management',
                element: <DeliveriesTable />
              },
              {
                path: 'reports',
                element: <Reports />
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
                index: true, // Defaultowa ścieżka
                element: <Navigate to="incoming" replace />
              },
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
                index: true, // Defaultowa ścieżka
                element: <Navigate to="created" replace />
              },
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
            element: <FriendTab />, // Główna zakładka znajomych
            children: [
              {
                index: true, // Defaultowa ścieżka
                element: <Navigate to="list" replace />
              },
              {
                path: 'list',
                element: <FriendList listType={FriendListType.List} /> // Lista znajomych
              },
              {
                path: 'outgoing',
                element: <FriendList listType={FriendListType.Outgoing} /> // Wysłane zaproszenia
              },
              {
                path: 'incoming',
                element: <FriendList listType={FriendListType.Incoming} /> // Otrzymane zaproszenia
              }
            ]
          },
          {
            path: 'reports',
            element: <ReportsTab />,
            children: [
              {
                index: true, // Defaultowa ścieżka
                element: <Navigate to="created" replace />
              },
              {
                path: 'created',
                element: <ReportsList listType={ReportsListType.Created} />
              }
            ]
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
    loader: checkIfCustomerService,
    children: [
      {
        path: 'reports/:reportId?',
        element: <ComplaintsList />
      },
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
    path: '/logout',
    action: logoutAction
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
