import { FriendStatus, LocalType } from './enums';

export type LoginResponseType = {
  token: string;
  firstName: string;
  lastName: string;
  roles: string[];
  userId: string;
};

export type RestaurantDetailsType = {
  restaurantId: number,
  name: string,
  restaurantType: LocalType,
  address: string,
  postalIndex: string,
  city: string,
  location: {
    latitude: number,
    longitude: number
  },
  tables: { 
    tableId: number, 
    capacity: number
  }[],
  provideDelivery: boolean,
  logo: string,
  photos: string[]
  description: string,
  reservationDeposit: null,
  tags: string[],
  rating: number,
  numberReviews: number
  rentalContract: string
  alcoholLicense: string
  businessPermission: string
  idCard: string
  nip: string;
  groupId: number;
};

export type GroupType = {
  restaurantGroupId: number;
  name: string;
  restaurants: RestaurantType[];
};

export type RestaurantShortType = {
  name: string,
  restaurantId: string
}

export type RestaurantType = {
  id: number;
  groupName: string;
  restaurantId: number;
  name: string;
  restaurantType: LocalType;
  address: string;
  city: string;
  isVerified: boolean;
};

export type RestaurantDataType = {
  name: string;
  address: string;
  postalIndex: string;
  city: string;
  nip: string;
  restaurantType: string;
  idCard: File | null | string;
  businessPermission: File | null | string;
  rentalContract: File | null | string;
  alcoholLicense: File | null | string;
  tags: string[];
  provideDelivery: boolean;
  logo: File | null | string;
  photos:  File[] | null | string[];
  description: string;
  groupId: number | null;
};

export type EmployeeType = {
  id: number;
  empID: string;
  login: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  employments: EmploymentType[];
};

export type EmployeeEmployedType = {
  id: number;
  empID: string;
  login: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isBackdoorEmployee: string;
  isHallEmployee: string;
  dateFrom: string;
  dateUntil: string;
  employmentId: string;
};

export type EmploymentType = {
  id: string,
  restaurantId: string,
  isBackdoorEmployee: string,
  isHallEmployee: string,
  restaurantName: string
}

export type MenuItemType = {
  menuItemId: number;
  name: string;
  alternateName: string;
  price: number;
  alcoholPercentage: number;
  photo: string;
}

export interface MenuItemWithDescriptionType {
  menuItemId: number;
  id: number;
  name: string;
  price: number;
  description: string;
  alternateName?: string;
  alcoholPercentage?: number;
  photo?: string;
}

export type  MenuIteminOrderType = {
  name: string;
  amount: number;
  price: number;
  status: string;
}

export type MenuType = {
  menuId: number;
  name: string;
  alternateName: string
  menuType: string;
  dateFrom: string;
  dateUntil: string | null;
  menuItems: MenuItemType[];
}

export type MenuWithDescriptionType = {
  menuId: number;
  name: string;
  alternateName: string
  menuType: string;
  photo: string;
  dateFrom: string;
  dateUntil: string | null;
  menuItems: MenuItemWithDescriptionType[];
}

export type FriendType = {
  userId: string,
  firstName: string,
  lastName: string,
  photo: string
};

export type MessageType = {
  messageId: number;
  contents: string;
  dateSent: string;
  dateRead: string;
  authorId: string;
  messageThreadId: number;
};

export type ThreadType = {
  threadId: number;
  title: string;
  participants: UserType[];
};

export type PaginationType = {
  page: number;
  totalPages: number;
  perPage: number;
  orderByOptions: string[];
  items: ThreadType[] | MessageType[] | UserSearchType[] | UserType[];
};

export type UserType = {
  userId: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export type RequestType = {
  dateSent: string;
  dateRead?: string;
  dateAccepted?: string;
  otherUser: FriendType;
};

export type ActionType = {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

export type CartItemType = {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export type UserSearchType = {
  friendStatus: FriendStatus;
} & UserType;

export type User ={
  userId: string,
  login: string,
  email: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  registeredAt: string,
  birthDate: string,
  roles: string[],
  employerId: string,
  photo: string
};

export type UserInfo = {
  firstName: string,
  login:string,
  lastName: string,
  roles: string[],
  photo: string
};

export type ReviewType ={
  reviewId: number,
  restaurantId: number,
  authorId: string,
  authorFullName: string,
  stars: number,
  createdAt: string,
  contents: string,
  answeredAt: string,
  restaurantResponse: string
}
