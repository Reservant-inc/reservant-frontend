import { LocalType } from "./enums";

export type LoginResponseType = {
  token: string;
  firstName: string;
  lastName: string;
  login: string;
  roles: string[];
};

export type RestaurantDetailsType = {
  id: number;
  name: string;
  restaurantType: string;
  nip: string;
  address: string;
  postalIndex: string;
  city: string;
  groupId: 0;
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
  restaurantCount: number;
};

export type RestaurantType = {
  restaurantId: number;
  name: string;
  restaurantType: LocalType;
  address: string;
  city: string;
  logo: string;
  groupId: 0;
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
  role: string;
  restaurant: string;
};
