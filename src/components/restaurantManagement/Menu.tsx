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
    setActivePage: Function
    activePage: Number
    setActiveSectionName: Function
    handleChangeActiveRestaurant: Function
}

const Menu:React.FC<MenuInterface> = ({ setActivePage, activePage, setActiveSectionName, handleChangeActiveRestaurant }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(activePage);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
        name: string
    ) => {
        handleChangeActiveRestaurant(null)
        setActiveSectionName(name)
        setActivePage(index)
        setSelectedIndex(index);
    };
    const size = useWindowDimensions();

  const [user, setUser] = useState<UserInfo>(JSON.parse(Cookies.get("userInfo") as string))

  return (
    <div id="menu-wrapper" className="">
      <div className="flex gap-2">
        
        <div className="p-0">
          <ListItemButton
            id="menu-listItem-restaurants-button"
            className={` ${selectedIndex === 1 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={(event) => handleListItemClick(event, 1, 'My restaurants')}
          >
            <div className="flex items-center gap-4">
              <LocalDiningSharpIcon  id="menu-listItem-restaurants-ico" className='w-6 h-6' />
              {size.width > 700 &&
                <h1>
                  Restaurants
                </h1>
              }
            </div>
          </ListItemButton>

        </div>
        <div id="menu-listItem-employees" className="p-0">
          <ListItemButton
            id="menu-listItem-employees-button"
            className={` ${selectedIndex === 2 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={(event) => handleListItemClick(event, 2, 'Employee management')}
          >
            <div className="flex items-center gap-4 w-full">
              <PeopleAltSharpIcon
                id="menu-listItem-emp-ico" className='w-6 h-6'
              />
              {size.width > 700 &&
              <h1>
                Employee management
              </h1>
              }
            </div>
          </ListItemButton>
        </div>
       
        <div id="menu-listItem-history" className="p-0">
          <ListItemButton
            id="menu-listItem-history-button"
            className={` ${selectedIndex === 6 ? "bg-white" : "bg-grey-0"} w-full h-full rounded-t-lg px-4`}
            onClick={(event) => handleListItemClick(event, 6, 'Reservation history')}
          >
            <div className="flex items-center gap-4 w-full">
              <ScheduleSharpIcon 
                id="menu-listItem-history-ico" className='w-6 h-6'
              />
            {size.width > 700 &&
            <h1>
              Reservation history
            </h1>
            }
            </div>

          </ListItemButton>
        </div>
      </div>
    </div>
  );
};

export default Menu;
