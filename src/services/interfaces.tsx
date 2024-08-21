import { ReactNode } from "react";
import { LoginResponseType, RestaurantDataType, RestaurantType } from "./types";


export interface CartItem {
  menuItemId: number;
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface MenuItem {
  menuItemId: number;
  id: number;
  name: string;
  price: number;
  description: string;
  alternateName?: string;
  alcoholPercentage?: number;
  photo?: string;
}


export interface Menu {
  menuId: number;
  name: string;
  alternateName: string
  menuType: string;
  dateFrom: string;
  dateUntil: string | null;
  menuItems: MenuItem[];
}

