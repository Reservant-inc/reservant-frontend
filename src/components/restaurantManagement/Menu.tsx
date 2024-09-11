import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, } from "@mui/material";
import React, { useState } from "react";
import AppsSharpIcon from '@mui/icons-material/AppsSharp';
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import MenuBookSharpIcon from '@mui/icons-material/MenuBookSharp';
import InventorySharpIcon from '@mui/icons-material/InventorySharp';
import MovingSharpIcon from '@mui/icons-material/MovingSharp';
import ScheduleSharpIcon from '@mui/icons-material/ScheduleSharp';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
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
  const [selectedIndex, setSelectedIndex] = React.useState(activePage);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    name: string,
  ) => {
    setActiveRestaurantId(null);
    setActiveSectionName(name);
    setActivePage(index);
    setSelectedIndex(index);
  };
  const size = useWindowDimensions();

  const [user, setUser] = useState<UserInfo>(JSON.parse(Cookies.get("userInfo") as string))

  return (
    <div id="menu-wrapper" className="">
        <List id="menu-list">
            <ListItem id="menu-listItem-dash" className="">
                <ListItemButton
                    id="menu-listItem-dash-button"
                    className={`rounded-lg ${selectedIndex === 0 ? "bg-grey-2" : ""}`}
                    onClick={(event) => handleListItemClick(event, 0, `Hello, ${JSON.parse(Cookies.get("userInfo") as string).firstName}`)}
                >
                    <ListItemIcon id="menu-listItem-dash-ico" className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                        <AppsSharpIcon className="dark:text-white"/>
                    </ListItemIcon>
                    {size.width > 1330 &&
                        <ListItemText id="menu-listItem-dash-text" primary="Restaurant Dashboard"/>
                    }
                </ListItemButton>
            </ListItem>
            <ListItem id="menu-listItem-restaurants">
                <ListItemButton
                    id="menu-listItem-restaurants-button"
                    className={`rounded-lg ${selectedIndex === 1 ? "bg-grey-2" : ""} `}
                    onClick={(event) => handleListItemClick(event, 1, 'My restaurants')}
                >
                    <ListItemIcon id="menu-listItem-restaurants-ico" className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <LocalDiningSharpIcon className="dark:text-white"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText id="menu-listItem-restaurants-text" primary="Restaurants" />}
                </ListItemButton >
            </ListItem>
            <ListItem id="menu-listItem-employees">
                <ListItemButton
                id="menu-listItem-employees-button"
                    className={`rounded-lg ${selectedIndex === 2 ? "bg-grey-2" : ""}  `}
                    onClick={(event) => handleListItemClick(event, 2, 'Employee management')}
                >
                    <ListItemIcon id="menu-listItem-emp-ico" className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <PeopleAltSharpIcon className="dark:text-white"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText id="menu-listItem-emp-text" primary="Employee management" />}
                </ListItemButton>
            </ListItem>
            <ListItem id="menu-listItem-menuManagement">
                <ListItemButton
                    id="menu-listItem-menuManagement-button"

                    className={`rounded-lg ${selectedIndex === 3 ? "bg-grey-2" : ""} `}
                    onClick={(event) => handleListItemClick(event, 3, 'Menu management')}
                >
                    <ListItemIcon id="menu-listItem-menuManagement-ico" className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <MenuBookSharpIcon className="dark:text-white"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText id="menu-listItem-menuManagement-text" primary="Menu management" />
}
                </ListItemButton>
            </ListItem>
            <ListItem id="menu-listItem-shipment">
                <ListItemButton
                    id="menu-listItem-Shipment-button"

                    className={`rounded-lg ${selectedIndex === 4 ? "bg-grey-2" : ""}  `}
                    onClick={(event) => handleListItemClick(event, 4, 'Shipment management')}
                >
                    <ListItemIcon id="menu-listItem-shipment-ico" className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <InventorySharpIcon className="dark:text-white"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText id="menu-listItem-shipment-text" primary="Shipment management" />
}
                </ListItemButton>
            </ListItem>
            <ListItem id="menu-listItem-stats">
                <ListItemButton
                    id="menu-listItem-Statistics-button"

                    className={`rounded-lg ${selectedIndex === 5 ? "bg-grey-2" : ""}  `}
                    onClick={(event) => handleListItemClick(event, 5, 'Statistics')}
                >
                    <ListItemIcon id="menu-listItem-stats-ico" className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <MovingSharpIcon className="dark:text-white"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText id="menu-listItem-stats-text" primary="Statistics" />
}
                </ListItemButton>
            </ListItem>
            <ListItem id="menu-listItem-history">
                <ListItemButton
                    id="menu-listItem-history-button"

                    className={`rounded-lg ${selectedIndex === 6 ? "bg-grey-2" : ""} `}
                    onClick={(event) => handleListItemClick(event, 6, 'Reservation history')}
                >
                    <ListItemIcon id="menu-listItem-history-ico" className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <ScheduleSharpIcon className="dark:text-white"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText id="menu-listItem-history-text" primary="Reservation history" />}
                </ListItemButton>
            </ListItem>
        </List>
    </div>
  );
};

export default Menu;
