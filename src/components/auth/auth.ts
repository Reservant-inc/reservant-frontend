import Cookies from 'js-cookie'

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
    throw new Response('', { status: 302, headers: { Location: '/login' } })
  }

  const isCS = isCustomerService()

  if (isCS) {
    throw new Response('', {
      status: 302,
      headers: { Location: '/customer-service' }
    })
  }

  return null
}

export function checkIfCustomerService() {
  const isLogged = isLoggedIn()

  if (!isLogged) {
    throw new Response('', { status: 302, headers: { Location: '/login' } })
  }

  const isCS = isCustomerService()

  if (!isCS) {
    const isCust = isCustomer()

    if (isCust) {
      throw new Response('', {
        status: 302,
        headers: { Location: '/reservant/home' }
      })
    }
  }
  return null
}

export function redirectIfLoggedIn() {
  const isLogged = isLoggedIn()
  if (isLogged) {
    throw new Response('', {
      status: 302,
      headers: { Location: '/reservant/home' }
    })
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
    throw new Response('', {
      status: 302,
      headers: { Location: '/reservant/home' }
    })
  }
  return null
}
