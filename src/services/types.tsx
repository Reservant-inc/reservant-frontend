import { LocalType } from "./enums"

export type LoginResponseType = {
    token: string,
    firstName: string,
    lastName: string,
    roles: string[]
}

export type RestaurantDetailsType = {
    id: number,
    name: string,
    restaurantType: string,
    nip: string,
    address: string,
    postalIndex: string,
    city: string,
    groupId: 0,
    groupName: string,
    rentalContract: string,
    alcoholLicense: string,
    businessPermission: string,
    idCard: string,
    tables: [{}],
    provideDelivery: boolean,
    logo: string,
    photos: string[],
    description: string,
    tags: string[]
  }

  export type GroupType = {
    id: number,
    name: string,
    restaurantCount: number
  }

  export type RestaurantType = {
    id: number,
    name: string,
    restaurantType: LocalType,
    address: string,
    city: string,
    groupId: 0
  }

  export type RestaurantDataType = {
    name: string;
    address: string;
    postalIndex: string;
    city: string;
    nip: string;
    restaurantType: string;
    idCardFile: File | null;
    idCard: string;
    businessPermissionFile: File | null;
    businessPermission: string; 
    rentalContractFile: File | null;
    rentalContract: string;
    alcoholLicenseFile: File | null;
    alcoholLicense: string;
    tags: string[];
    provideDelivery: boolean;
    logoFile: File | null;
    logo: string;
    photosFile: File[] | null;
    photos: string[];
    description: string;
    groupId: number | null; 
  }