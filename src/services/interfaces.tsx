import { ReactNode } from "react";
import { LoginResponseType, RestaurantDataType, RestaurantType } from "./types";

export interface SectionProps {}

export interface AuthContextValue {
  isAuthorized: boolean;
  login: (token: LoginResponseType) => void;
  setIsAuthorized: () => {};
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
}

export interface RestaurantDataProps {
  restaurant: RestaurantDataType;
}

export interface MyGroupsProps {
  handleChangeActiveRestaurant: (restaurantGroupId: number) => void;
  setActiveSectionName: (sectionName: string) => void
  filter: string;
}

export interface GroupProps {
  name: string;
  filter: string,
  restaurants: RestaurantType[];
  handleChangeActiveRestaurant: (restaurantGroupId: number) => void;
  setActiveSectionName: (sectionName: string) => void
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
  sections: React.FC;
  menu: React.FC;
}

export interface ManagementSectionProps {
  currentPage: number;
  desiredPage: number;
  setActivePage: Function;
  component: ReactNode;
}
