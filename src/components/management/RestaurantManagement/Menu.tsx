import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider} from "@mui/material";
import React from "react";
import AppsSharpIcon from '@mui/icons-material/AppsSharp';
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import MenuBookSharpIcon from '@mui/icons-material/MenuBookSharp';
import InventorySharpIcon from '@mui/icons-material/InventorySharp';
import MovingSharpIcon from '@mui/icons-material/MovingSharp';
import ScheduleSharpIcon from '@mui/icons-material/ScheduleSharp';
import LocalDiningSharpIcon from '@mui/icons-material/LocalDiningSharp';
import Cookies from "js-cookie";
import useWindowDimensions from "../../../hooks/useWindowResize";

interface MenuInterface {
    setActivePage: Function
    activePage: Number
    setActiveSectionName: Function
}

const Menu:React.FC<MenuInterface> = ({ setActivePage, activePage, setActiveSectionName }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(activePage);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
        name: string
    ) => {
        setActiveSectionName(name)
        setActivePage(index)
        setSelectedIndex(index);
    };
    const size = useWindowDimensions();

    return(
    <div className="dark:text-grey-1">
        <List>
            <ListItem className="">
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 0 ? "bg-grey-1 dark:bg-grey-4" : ""} `}
                    onClick={(event) => handleListItemClick(event, 0, `Hello, ${JSON.parse(Cookies.get("userInfo") as string).firstName}`)}
                >
                    <ListItemIcon className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                        <AppsSharpIcon className="dark:text-grey-1"/>
                    </ListItemIcon>
                    {size.width > 1330 &&
                        <ListItemText primary="Restaurant Dashboard"/>
                    }
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 1 ? "bg-grey-1 dark:bg-grey-4" : ""} `}
                    onClick={(event) => handleListItemClick(event, 1, 'My restaurants')}
                >
                    <ListItemIcon className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <LocalDiningSharpIcon className="dark:text-grey-1"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText primary="Restaurants" />}
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 2 ? "bg-grey-1 dark:bg-grey-4" : ""}  `}
                    onClick={(event) => handleListItemClick(event, 2, 'Employee management')}
                >
                    <ListItemIcon className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <PeopleAltSharpIcon className="dark:text-grey-1"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText primary="Employee management" />}
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 3 ? "bg-grey-1 dark:bg-grey-4" : ""} `}
                    onClick={(event) => handleListItemClick(event, 3, 'Menu management')}
                >
                    <ListItemIcon className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <MenuBookSharpIcon className="dark:text-grey-1"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText primary="Menu management" />
}
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 4 ? "bg-grey-1 dark:bg-grey-4" : ""}  `}
                    onClick={(event) => handleListItemClick(event, 4, 'Shipment management')}
                >
                    <ListItemIcon className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <InventorySharpIcon className="dark:text-grey-1"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText primary="Shipment management" />
}
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 5 ? "bg-grey-1 dark:bg-grey-4" : ""}  `}
                    onClick={(event) => handleListItemClick(event, 5, 'Statistics')}
                >
                    <ListItemIcon className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <MovingSharpIcon className="dark:text-grey-1"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText primary="Statistics" />
}
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 6 ? "bg-grey-1 dark:bg-grey-4" : ""} `}
                    onClick={(event) => handleListItemClick(event, 6, 'Reservation history')}
                >
                    <ListItemIcon className={` ${size.width>1330?"":"justify-center w-full h-full"}`}>
                    <ScheduleSharpIcon className="dark:text-grey-1"/>
                </ListItemIcon>
                {size.width > 1330 &&
                <ListItemText primary="Reservation history" />}
                </ListItemButton>
            </ListItem>
        </List>
    </div>
    )
}

export default Menu;