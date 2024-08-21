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
