import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { useState } from "react";
import AppsSharpIcon from "@mui/icons-material/AppsSharp";
import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import LocalDiningSharpIcon from "@mui/icons-material/LocalDiningSharp";
import Cookies from "js-cookie";
import useWindowDimensions from "../../hooks/useWindowResize";
import { UserInfo } from "../../services/types";

interface MenuInterface {
  setActivePage: Function;
  activePage: Number;
  setActiveSectionName: Function;
  setActiveRestaurantId: Function;
}

const Menu: React.FC<MenuInterface> = ({
  setActivePage,
  activePage,
  setActiveSectionName,
  setActiveRestaurantId,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(activePage);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    name: string
  ) => {
    setActiveRestaurantId(null);
    setActiveSectionName(name);
    setActivePage(index);
    setSelectedIndex(index);
  };

  const size = useWindowDimensions();
  const [user, setUser] = useState<UserInfo>(
    JSON.parse(Cookies.get("userInfo") as string)
  );

  return (
    <div id="menu-wrapper" className="w-full">
      <List
        id="menu-list"
        className="flex flex-row justify-start" 
      >
        <ListItem id="menu-listItem-dash" className="p-0">
          <ListItemButton
            id="menu-listItem-dash-button"
            className={`rounded-lg ${
              selectedIndex === 0 ? "bg-grey-1 dark:bg-grey-4" : "dark:hover:bg-grey-5"
            }`}
            onClick={(event) =>
              handleListItemClick(event, 0, `Hello, ${user.firstName}`)
            }
          >
            <ListItemIcon
              id="menu-listItem-dash-ico"
              className={`${
                size.width > 1330 ? "" : "justify-center w-full h-full dark:text"
              }`}
            >
              <AppsSharpIcon  className="dark:text-white"/>
            </ListItemIcon>
            {size.width > 1330 && (
              <ListItemText
                id="menu-listItem-dash-text"
                primary="Restaurant Dashboard"
              />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem id="menu-listItem-restaurants" className="p-0">
          <ListItemButton
            id="menu-listItem-restaurants-button"
            className={`rounded-lg ${
              selectedIndex === 1 ? "bg-grey-1 dark:bg-grey-4" : "dark:hover:bg-grey-5"
            }`}
            onClick={(event) =>
              handleListItemClick(event, 1, "My restaurants")
            }
          >
            <ListItemIcon
              id="menu-listItem-restaurants-ico"
              className={`${
                size.width > 1330 ? "" : "justify-center w-full h-full"
              }`}
            >
              <LocalDiningSharpIcon  className="dark:text-white"/>
            </ListItemIcon>
            {size.width > 1330 && (
              <ListItemText
                id="menu-listItem-restaurants-text"
                primary="Restaurants"
              />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem id="menu-listItem-employees" className="p-0">
          <ListItemButton
            id="menu-listItem-employees-button"
            className={`rounded-lg ${
              selectedIndex === 2 ? "bg-grey-1 dark:bg-grey-4" : "dark:hover:bg-grey-5"
            }`}
            onClick={(event) =>
              handleListItemClick(event, 2, "Employee management")
            }
          >
            <ListItemIcon
              id="menu-listItem-emp-ico"
              className={`${
                size.width > 1330 ? "" : "justify-center w-full h-full"
              }`}
            >
              <PeopleAltSharpIcon  className="dark:text-white"/>
            </ListItemIcon>
            {size.width > 1330 && (
              <ListItemText
                id="menu-listItem-emp-text"
                primary="Employee management"
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
};

export default Menu;
