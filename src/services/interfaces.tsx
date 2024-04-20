import { ReactNode } from "react";
import { LoginResponseType, RestaurantDataType } from "./types";

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
    onOutsideClick: () => void
    isPressed: boolean
    children: ReactNode
  }

export interface RestaurantDetailsProps {
    activeRestaurantId: number | null;
}

export interface RestaurantDataProps {
    restaurant: {
        id: number;
        name: String;
        address: String;
        postalIndex: String;
        city: String;
        logo: String;
        description: String;
        photos: String[];
    };
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