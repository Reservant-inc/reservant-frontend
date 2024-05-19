import { ReactNode } from "react";
import { LoginResponseType, RestaurantDataType } from "./types";

export interface SectionProps {
  component: ReactNode;
  connString: string;
  id: string;
}

export interface AuthContextValue {
  isAuthorized: boolean;
  login: (token: LoginResponseType) => void;
  logout: () => void;
}

export interface PopupProps {
  children: ReactNode;
  buttonText?: String;
  bgColor?: String;
  modalTitle?: String;
}

export interface OutsideClickHandlerProps {
  onOutsideClick: () => void;
  isPressed: boolean;
  children: ReactNode;
}

export interface RestaurantDetailsProps {
  activeRestaurantId: number | null;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RestaurantDataProps {
  restaurant: RestaurantDataType;
}

export interface MyGroupsProps {
  handleChangeActiveRestaurant: (id: number) => void;
  activeRestaurantId: number | null;
}

export interface GroupProps {
  id: number;
  name: string;
  restaurantCount: number;
  handleChangeActiveRestaurant: (id: number) => void;
  activeRestaurantId: number | null;
}

export interface RegisterStep1Props {
  onSubmit: (data: Partial<RestaurantDataType>) => void;
  initialValues: Partial<RestaurantDataType>;
}

export interface RegisterStep2Props {
  onSubmit: (data: Partial<RestaurantDataType>) => void;
  onBack: () => void;
}

export interface NavBarProps {
  sections: React.FC,
  menu: React.FC
}

export interface ManagementSectionProps {
  currentPage: number,
  desiredPage: number,
  setActivePage: Function,
  component: ReactNode
}
