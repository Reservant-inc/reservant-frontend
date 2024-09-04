import { FriendStatus, LocalType } from "./enums";

export type LoginResponseType = {
  token: string;
  firstName: string;
  lastName: string;
  roles: string[];
  userId: string;
};

export type RestaurantDetailsType = {
  id: number;
  name: string;
  restaurantType: string;
  nip: string;
  address: string;
  postalIndex: string;
  city: string;
  groupId: number;
  groupName: string;
  rentalContract: string;
  alcoholLicense: string;
  businessPermission: string;
  idCard: string;
  tables: [{}];
  provideDelivery: boolean;
  logo: string;
  photos: string[];
  description: string;
  tags: string[];
};

export type GroupType = {
  restaurantGroupId: number;
  name: string;
  restaurants: RestaurantType[];
};

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
  photos: File[] | null | string[];
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
  id: string;
  restaurantId: string;
  isBackdoorEmployee: string;
  isHallEmployee: string;
  restaurantName: string;
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

export type UserSearchType = {
  friendStatus: FriendStatus;
} & UserType;
