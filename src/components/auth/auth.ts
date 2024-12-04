import Cookies from 'js-cookie'
import { redirect } from 'react-router-dom'

const isLoggedIn = () => {
  const isLoggedIn = Boolean(Cookies.get('token'))
  return isLoggedIn
}

const isCustomerService = () => {
  const isCustomerServiceEmployee = Boolean(
    JSON.parse(Cookies.get('userInfo') as string).roles.some(
      (role: string) =>
        role === 'CustomerSupportAgent' || role === 'CustomerSupportManager'
    )
  )
  return isCustomerServiceEmployee
}

const isCustomer = () => {
  const isCust = Boolean(
    JSON.parse(Cookies.get('userInfo') as string).roles.includes('Customer')
  )
  return isCust
}

export function checkAuthLoader() {
  const isLogged = isLoggedIn()

  if (!isLogged) {
    return redirect('/login')
  }

  const isCS = isCustomerService()

  if (isCS) {
    return redirect('/customer-service')
  }

  return null
}

export function checkIfCustomerService() {
  const isLogged = isLoggedIn()

  if (!isLogged) {
    return redirect('/login')
  }

  const isCS = isCustomerService()

  if (!isCS) {
    const isCust = isCustomer()

    if (isCust) {
      return redirect('/reservant/home')
    }
  }
  return null
}

export function redirectIfLoggedIn() {
  const isLogged = isLoggedIn()
  if (isLogged) {
    return redirect('/reservant/home')
  }
  return null
}

export function checkIfOwner() {
  const isOwner = Boolean(
    JSON.parse(Cookies.get('userInfo') as string).roles.includes(
      'Restaurant Owner'
    )
  )
  if (isOwner) {
    return redirect('/reservant/home')
  }
  return null
}

export function logoutAction() {
  console.log('Logout action triggered')
  Cookies.remove('token')
  Cookies.remove('userInfo')
  return redirect('/')
}
