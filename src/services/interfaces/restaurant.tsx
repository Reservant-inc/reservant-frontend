import { ReactNode } from "react";
import { LoginResponseType, RestaurantDataType, RestaurantType } from "../types";
import { GridRowModesModel, GridRowsProp } from "@mui/x-data-grid";

export interface SectionProps {}

export interface AuthContextValue {
  isAuthorized: boolean;
  login: (token: LoginResponseType) => void;
  setIsAuthorized: () => {};
}

export interface RestaurantDetailsProps {
  activeRestaurantId: number | null;
}

export interface RestaurantDataProps {
  restaurant: RestaurantDataType;
}

export interface MyGroupsProps {
  handleChangeActiveRestaurant: (restaurantGroupId: number) => void;
  setActiveSectionName: (sectionName: string) => void;
  filter: string;
}

export interface GroupProps {
  name: string;
  filter: string;
  restaurants: RestaurantType[];
  handleChangeActiveRestaurant: (restaurantGroupId: number) => void;
  setActiveSectionName: (sectionName: string) => void;
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

export interface RestaurantCartProps {
  cart: CartItem[];
  incrementQuantity: (itemId: number) => void;
  decrementQuantity: (itemId: number) => void;
}

export interface CartItem {
  menuItemId: number;
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface MenuProps {
  menuId: number;
  name: string;
  alternateName: string
  menuType: string;
  dateFrom: string;
  dateUntil: string | null;
  menuItems: MenuItemProps[];
}



 export interface MenuItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: { [key: string]: string }) => void;
  menuType: string;
  editedMenuItem?: MenuItemProps | null;
}

export interface MenuItemProps {
  menuItemId: number;
  name: string;
  id: number, 
  description: string;
  alternateName: string;
  price: number;
  alcoholPercentage: number;
  photo?: string;
  menuType: string;
  onDelete: () => void;
  onEdit: () => void;
}

export interface FriendRequestProps {
  senderId: string;
  senderName: string;
  dateSent: string;
  onAction: (senderId: string) => void;
}

export interface FriendSearchBarProps {}

export interface Friend {
  senderId: string;
  senderName: string;
}

export interface SendFriendRequestProps {
  user: {
    senderId: string;
    senderName: string;
  };
  request: any;
  isFriend: any;
  isRequestReceived: any;
  handleInvite: (userId: string) => void;
  handleCancelInvite: (userId: string) => void;
  handleRemoveFriend: (userId: string) => void;
}

export interface FocusedRestaurantDetailsProps {
  restaurantId: number;
  onClose: () => void;
}

export interface FocusedRestaurantMenuItemProps {
  item: MenuItemProps;
}

export interface FocusedRestaurantMenuListProps {
  restaurantId: number;
}

export interface FocusedRestaurantReviewsListProps {
  isPreview: boolean;
  reviews: any[];
}

export interface EditEmployeeToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

export interface RestaurantCreateEventProps {
  open: boolean;
  handleClose: () => void;
  restaurantName: string;
  restaurantId: number;
}

export interface RestaurantDetailsProps {
  addToCart: (item: MenuItemProps) => void;
  restaurantId: string | undefined;
}


export interface Event {
  eventId: number;
  description: string;
  time: string;
  mustJoinUntil: string;
  creatorFullName: string;
  numberInterested: number;
}

export interface RestaurantEventsViewProps {
  restaurantId: number;
  events: Event[];
  restaurantName: string;
}

export interface MenuItemComponentProps {
  item: MenuItemProps;
  addToCart: (item: Omit<MenuItemProps, "quantity">) => void;
}

export interface RestaurantReviewFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export interface FilterMenuProps {
  handleFilterOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleFilterClose: () => void;
  filterAnchorEl: HTMLElement | null;
  handleSortAlphabetically: () => void;
  handleSortPriceAsc: ()  => void;
  handleSortPriceDesc: ()  => void;
  handleSortAlcoholAsc: ()  => void;
  handleSortAlcoholDesc: ()  => void;
  handleClearFilters: () => void;
}

export interface MenuDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: { [key: string]: string }) => void;
  editedMenu?: { [key: string]: string } | null;
}

export interface ManagementProps {
  activeRestaurantId: number | null;
}

export interface OrderRowProps {
  row: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export interface MenuItem {
  name: string;
  amount: number;
  price: number;
  status: string;
}

export interface RestaurantReviewProps {
  createdAt: string;
  stars: number;
  contents: string;
}

export interface RestaurantReviewsFiltersProps {
  sort: string;
  setSort: (value: string) => void;
  filterText: string;
  setFilterText: (text: string) => void;
}

export interface RestaurantReviewsListProps {
  isPreview: boolean
}

export interface MenuInterface {
  setActivePage: Function
  activePage: Number
  setActiveSectionName: Function
  setActiveRestaurantId: Function
}
