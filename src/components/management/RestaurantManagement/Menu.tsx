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

    return(
    <div className="">
        <List>
            <ListItem>
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 0 ? "bg-grey-1" : ""}`}
                    onClick={(event) => handleListItemClick(event, 0, `Hello, ${JSON.parse(Cookies.get("userInfo") as string).firstName}`)}
                >
                <ListItemIcon>
                    <AppsSharpIcon/>
                </ListItemIcon>
                <ListItemText primary="Restaurant Dashboard" />
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 1 ? "bg-grey-1" : ""}`}
                    onClick={(event) => handleListItemClick(event, 1, 'My restaurants')}
                >
                <ListItemIcon>
                    <LocalDiningSharpIcon/>
                </ListItemIcon>
                <ListItemText primary="Restaurants" />
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 2 ? "bg-grey-1" : ""}`}
                    onClick={(event) => handleListItemClick(event, 2, 'Employee management')}
                >
                <ListItemIcon>
                    <PeopleAltSharpIcon/>
                </ListItemIcon>
                <ListItemText primary="Employee management" />
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 3 ? "bg-grey-1" : ""}`}
                    onClick={(event) => handleListItemClick(event, 3, 'Menu management')}
                >
                <ListItemIcon>
                    <MenuBookSharpIcon/>
                </ListItemIcon>
                <ListItemText primary="Menu management" />
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 4 ? "bg-grey-1" : ""}`}
                    onClick={(event) => handleListItemClick(event, 4, 'Shipment management')}
                >
                <ListItemIcon>
                    <InventorySharpIcon/>
                </ListItemIcon>
                <ListItemText primary="Shipment management" />
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 5 ? "bg-grey-1" : ""}`}
                    onClick={(event) => handleListItemClick(event, 5, 'Statistics')}
                >
                <ListItemIcon>
                    <MovingSharpIcon/>
                </ListItemIcon>
                <ListItemText primary="Statistics" />
                </ListItemButton>
            </ListItem>
            <ListItem >
                <ListItemButton
                    className={`rounded-lg ${selectedIndex === 6 ? "bg-grey-1" : ""}`}
                    onClick={(event) => handleListItemClick(event, 6, 'Reservation history')}
                >
                <ListItemIcon>
                    <ScheduleSharpIcon/>
                </ListItemIcon>
                <ListItemText primary="Reservation history" />
                </ListItemButton>
            </ListItem>
        </List>
    </div>
    )
}

export default Menu;