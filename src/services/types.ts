import { ReactElement } from 'react'
import { FriendStatus, LocalType, UnitOfMeasurement } from './enums'

export type Routing = {
  path: string
  element: ReactElement
  isPrivate: boolean
  navbar: boolean
  roles: string[]
}[]

export type LoginResponseType = {
  token: string
  firstName: string
  lastName: string
  roles: string[]
  userId: string
}

export type RestaurantDetailsType = {
  restaurantId: number
  name: string
  restaurantType: LocalType
  address: string
  postalIndex: string
  city: string
  location: {
    latitude: number
    longitude: number
  }
  tables: {
    tableId: number
    capacity: number
  }[]
  provideDelivery: boolean
  logo: string
  photos: string[]
  description: string
  reservationDeposit: number
  distanceFrom: number | null
  openingHours: OpeningHoursType[]
  tags: string[]
  rating: number
  numberReviews: number
  rentalContract: string
  alcoholLicense: string
  businessPermission: string
  idCard: string
  nip: string
  groupId: number
  maxReservationDurationMinutes: number
  isVerified: true
  isArchived: true
}

export type GroupType = {
  restaurantGroupId: number
  name: string
  restaurants: RestaurantType[]
}

export type RestaurantShortType = {
  name: string
  restaurantId: string
}

export type RestaurantType = {
  id: number
  groupId: number
  groupName: string
  restaurantId: number
  name: string
  restaurantType: LocalType
  address: string
  city: string
  isVerified: boolean
  reservationDeposit: number
  location: {
    latitude: number
    longitude: number
  }
  maxReservationDurationMinutes: number
  tags: string[]
  provideDelivery: boolean
  logo: string
  description: string
  openingHours: OpeningHoursType[]
  nip: string
  idCard: string
  photos: string[]
  postalIndex: string
  businessPermission: string
  rentalContract: string
  alcoholLicense: string
  tables: {
    tableId: number
    capacity: number
  }[]
  isArchived?: boolean
}

export type OpeningHoursType = {
  from: string
  until: string
}

export type RestaurantDataType = {
  name: string
  address: string
  postalIndex: string
  city: string
  nip: string
  restaurantType: string
  idCard: File | null | string
  businessPermission: File | null | string
  rentalContract: File | null | string
  alcoholLicense: File | null | string
  tags: string[]
  provideDelivery: boolean
  logo: File | null | string
  photos: File[] | null | string[]
  description: string
  groupId: number | null
  reservationDeposit: number | null
  openingHours: OpeningHoursType[]
  maxReservationDurationMinutes: number | null
  location: {
    latitude: number
    longitude: number
  }
}

export type EmployeeType = {
  id: number
  userId: string
  login: string
  firstName: string
  lastName: string
  phoneNumber: { code: string; number: string }
  birthDate: string
  employments: EmploymentType[]
}

export type EmployeeEmployedType = {
  id: number
  empID: string
  login: string
  firstName: string
  lastName: string
  phoneNumber: string
  isBackdoorEmployee: string
  isHallEmployee: string
  dateFrom: string
  dateUntil: string
  employmentId: string
}

export type EmploymentType = {
  employmentId: string
  restaurantId: string
  isBackdoorEmployee: string
  isHallEmployee: string
  restaurantName: string
}

export type MenuItemType = {
  menuItemId: number
  name: string
  alternateName: string
  price: number
  alcoholPercentage: number
  photo: string
}

export type IngredientUsage = {
  ingredientId: string
  amountUsed: number
}

export type IngredientType = {
  ingredientId: number
  publicName: string
  unitOfMeasurement: UnitOfMeasurement
  minimalAmount: number
  amountToOrder: number
  amount: number
}

export type ItemWithIngredientsType = {
  ingredients: IngredientType[]
} & MenuItemType

export type MenuItemInOrderType = {
  menuItem: MenuItemType
  amount: number
  oneItemPrice: number
  totalCost: number
  status: string
}

export type MenuType = {
  menuId: number
  name: string
  alternateName: string
  menuType: string
  dateFrom: string
  dateUntil: string | null
  menuItems: MenuItemType[]
}

export type FriendType = {
  userId: string
  firstName: string
  lastName: string
  photo: string
}

export type MessageType = {
  messageId: number
  contents: string
  dateSent: string
  dateRead: string
  authorId: string
  messageThreadId: number
}

export type ThreadType = {
  threadId: number
  title: string
  participants: UserType[]
  type: string
}

export type PaginationType = {
  page: number
  totalPages: number
  perPage: number
  orderByOptions: string[]
  items: any[]
}

export type UserType = {
  userId: string
  login?: string
  birthDate?: string
  firstName: string
  lastName: string
  photo: string
  phoneNumber?: {
    code: string
    number: number
  }
  email?: string
}

export type RequestType = {
  dateSent: string
  dateRead?: string
  dateAccepted?: string
  otherUser: FriendType
}

export type ActionType = {
  icon: React.ReactNode
  name: string
  onClick: () => void
}

export type TransactionType = {
  transactionId: number
  title: string
  amount: number
  time: Date
}

export type CartItemType = {
  menuItemId: number
  name: string
  price: number
  amount: number
  photo: string
}

export type UserSearchType = {
  friendStatus: FriendStatus
} & UserType

export type User = {
  userId: string
  login: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  registeredAt: string
  birthDate: string
  roles: string[]
  employerId: string
  photo: string
}

export type UserInfo = {
  firstName: string
  login: string
  lastName: string
  roles: string[]
  photo: string
}

export type Ingredient = {
  ingredientId: string
  publicName: string
  unitOfMeasurement: string
  minimalAmount: number
  amountToOrder: number
  amount: number
}
export type ReviewType = {
  reviewId: number
  restaurantId: number
  authorId: string
  authorFullName: string
  stars: number
  createdAt: string
  contents: string
  dateEdited: string
  answeredAt: string
  restaurantResponse: string
}

export type VisitType = {
  clientId: string
  date: string
  deposit: number
  endTime: string
  numberOfGuests: number
  actualStartTime?: string
  actualEndTime?: string
  orders: OrderType[]
  participants: UserType[]
  paymentTime: string
  reservationDate: string
  restaurant: RestaurantDetailsType
  tableId: number
  takeaway: boolean
  tip: number
  visitId: number
}

export type OrderType = {
  orderId: number
  visitId: number
  cost: number
  status: string
  items: MenuItemInOrderType[]
  assignedEmployee: UserType
}

export type ReservationType = {
  friendsToAdd: UserType[]
  selectedTimeslot: string
  guests: number
  date: string
}

export type EventDataType = {
  eventId: number
  name: string
  description: string
  time: string
  maxPeople: number
  mustJoinUntil: string
  creator: {
    userId: string
    firstName: string
    lastName: string
    photo: string
  }
  participants: Array<{
    userId: string
    firstName: string
    lastName: string
    photo: string
  }>
  restaurant: {
    restaurantId: number | null
    name: string
    address: string
    city: string
    logo: string
    rating: number
    numberReviews: number
  }
  numberInterested: number
  photo: string | null
}

export type EventDialogState = {
  isOpen: boolean
  type:
    | 'delete'
    | 'leave'
    | 'details'
    | 'manageParticipants'
    | 'edit'
    | 'seeParticipants'
    | null
}

export type InterestedUser = {
  userId: string
  firstName: string
  lastName: string
  photo: string
}

export type Participants = {
  userId: string
  firstName: string
  lastName: string
  photo: string
}

export type FriendData = {
  dateSent: string
  dateRead: string | null
  dateAccepted: string | null
  otherUser: {
    userId: string
    firstName: string
    lastName: string
    photo: string
  }
  privateMessageThreadId: number
}

export type Correction = {
  correctionId: number
  oldAmount: number
  newAmount: number
  correctionDate: string
  comment: string
  user: {
    userId: string
    firstName: string
    lastName: string
    photo: string | null
  }
}

export type IngredientHistoryDialogProps = {
  open: boolean
  onClose: () => void
  ingredient: IngredientType | null
}

export type GroceryListDialogProps = {
  open: boolean
  onClose: () => void
  groceryList: any[]
  setGroceryList: React.Dispatch<React.SetStateAction<any[]>>
  availableIngredients: any[]
  selectedDropdownIngredient: string
  onIngredientSelect: (value: string) => void
  onAddToGroceryList: () => void
  onIncreaseAmount: (id: number) => void
  onDecreaseAmount: (id: number) => void
  onRemoveItem: (id: number) => void
  onSubmitOrder: () => void
}

export type DeliveryActionDialogProps = {
  open: boolean
  onClose: () => void
  deliveryId: number
  action: 'confirm' | 'cancel'
  onActionComplete: () => void
}

export type DeliveryDetailsDialogProps = {
  open: boolean
  onClose: () => void
  deliveryId: number
}

export type ComplaintUserInfo = {
  userId: string
  firstName: string
  login: string
  lastName: string
  birthDate: string
  roles: string[]
  photo: string | null
  phoneNumber: {
    code: string
    number: string
  }
  bannedUntil: string
}

export type ReportType = {
  reportId: number
  description: string
  reportDate: string
  category: string
  createdBy: UserType
  reportedUser: UserType | null
  visit: VisitType | null
  resolutionComment: string
  resolvedBy: UserType
  resolutionDate: string
  assignedAgents: {
    agent: UserType
    from: string
    until: string | null
  }[]
  reportStatus: string
  threadId: number
}

export type StatisticsType = {
  popularItems: {
    menuItem: MenuItemType
    amountOrdered: number
  }[]
  customerCount: {
    date: string
    customers: number
  }[]
  revenue: {
    date: string
    revenue: number
  }[]
  reviews: {
    date: string
    count: number
    average: number
  }[]
}
