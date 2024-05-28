import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchDELETE, fetchGET, fetchPOST, fetchPUT } from "../../../services/APIconn";

import MoreActions from "../../reusableComponents/MoreActions";
import MenuDialog from "./MenuDialog";
import MenuItemDialog from "./MenuItemDialog";
import MenuItem from "./MenuItem";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Button, IconButton, Menu, MenuItem as MyMenuItem } from "@mui/material";

interface MenuManagementProps {
  activeRestaurantId: number | null;
}

interface Menu {
    menuId: number;
    name: string;
    alternateName: string
    menuType: string;
    dateFrom: string;
    dateUntil: string | null;
    menuItems: MenuItemData[];
}

interface MenuItemData {
    menuItemId: number;
    name: string;
    alternateName: string;
    price: number;
    alcoholPercentage: number;
    photo: string;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ activeRestaurantId }) => {
    const { t } = useTranslation("global");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [menuNamesByRestaurant, setmenuNamesByRestaurant] = useState<{ [key: number]: string[] }>({});
    const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(0);
    const [editMenu, setEditMenu] = useState<Menu | null>(null);
    const [editedMenuItem, setEditedMenuItem] = useState<MenuItemData | null>(null);
    const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
    const [isEditMenuPopupOpen, setIsEditMenuPopupOpen] = useState(false);
    const [isMenuItemPopupOpen, setIsMenuItemPopupOpen] = useState(false);
    const [isMenuItemEditPopupOpen, setIsMenuItemEditPopupOpen] = useState(false);
    const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (activeRestaurantId !== null) {
      console.log(activeRestaurantId);
      fetchMenus(activeRestaurantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRestaurantId]);
    
    useEffect(() => {
        const isMenuFetched = selectedMenuIndex !== null && menus.length > selectedMenuIndex && menus[selectedMenuIndex].menuItems.length > 0;

        if (!isMenuFetched) {
            fetchMenuIemsForSelectedMenu();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menus, selectedMenuIndex]);

    const fetchMenuIemsForSelectedMenu = async () => {
        if (selectedMenuIndex !== null && menus.length > selectedMenuIndex) {
            const menuId = menus[selectedMenuIndex].menuId;
            try {
                const menuData = await fetchGET(`/menus/${menuId}`);
                console.log("Menu items for selected menu:", menuData);
                if (!menuData.menuItems || menuData.menuItems.length === 0) {
                    return;
                }
                setMenus(prevMenus => {
                    const updatedMenus = [...prevMenus];
                    updatedMenus[selectedMenuIndex] = {
                        ...updatedMenus[selectedMenuIndex],
                        menuItems: menuData.menuItems || []
                    };
                    return updatedMenus;
                });
            } catch (error) {
                console.error("Error fetching menu items for selected menu:", error);
            }
        }
    };

    const fetchMenus = async (restaurantId: number): Promise<Menu[]> => {
        try {
            const menusData: Menu[] = await fetchGET(`/my-restaurants/${restaurantId}/menus`);
            console.log("Menus data:", menusData);
            const validatedMenusData = menusData.map(menu => ({
                ...menu,
                menuItems: menu.menuItems || [], // Jeśli brakuje menuItems, ustaw na pustą tablicę
            }));
            const allMenuNames = validatedMenusData.map(menu => menu.name);
            setMenus(validatedMenusData);
            setmenuNamesByRestaurant({ [activeRestaurantId || 0]: allMenuNames });
            return validatedMenusData;
        } catch (error) {
            console.error("Error fetching menus:", error);
            return [];
        }
    };

    const handleSaveNewMenu = async (values: { [key: string]: string }) => {
        console.log('New menu values:', values);
    
        const body = JSON.stringify({
            restaurantId: activeRestaurantId,
            name: values.name,
            alternateName: values.alternateName,
            menuType: values.type,
            dateFrom: values.dateFrom,
            dateUntil: values.dateUntil,
        });
    
        try {
            const response = await fetchPOST('/menus', body);
            console.log("Response:", response);
            setIsMenuPopupOpen(false);
            if (activeRestaurantId !== null) {
                fetchMenus(activeRestaurantId);
            }
        } catch (error) {
            console.error("Error saving new menu:", error);
        }
    };
    
    const handleEditMenu = () => {
        if (selectedMenuIndex !== null && menuNamesByRestaurant[activeRestaurantId || 0]) {
            const selectedMenu = menus[selectedMenuIndex];
            setEditMenu(selectedMenu);
            setIsEditMenuPopupOpen(true);
        }
    };

    const handleSaveEditedMenu = async (values: { [key: string]: string }) => {
        if (selectedMenuIndex !== null && menuNamesByRestaurant[activeRestaurantId || 0]) {
            const body = JSON.stringify({
                name: values.name,
                alternateName: values.alternateName,
                menuType: values.type,
                dateFrom: values.dateFrom,
                dateUntil: values.dateUntil
            });
            try {
                const menuId = menus[selectedMenuIndex].menuId;
                const response = await fetchPUT(`/menus/${menuId}`, body);
                console.log("Response:", response);
                setIsEditMenuPopupOpen(false);
                if (activeRestaurantId !== null) {
                    fetchMenus(activeRestaurantId);
                }
            } catch (error) {
                console.error("Error while editing category:", error);
            }
        }
    };

    const handleDeleteMenu = async () => {
        try {
            if (selectedMenuIndex !== null && menus[selectedMenuIndex]) {
                const menuId = menus[selectedMenuIndex].menuId;
                const response = await fetchDELETE(`/menus/${menuId}`);
                setSelectedMenuIndex(null);
            } else {
                console.error("No menu selected to delete");
            }
        } catch (error) {
            console.error("Error while deleting menu:", error);
        }
        if (activeRestaurantId !== null) {
            fetchMenus(activeRestaurantId);
        }
    };

    const handleSaveNewMenuItem = async (values: { [key: string]: string }) => {
        try {

            console.log(activeRestaurantId)

            const body = JSON.stringify({
                restaurantId: activeRestaurantId,
                name: values.name,
                alternateName: values.alternateName,
                price: values.price,
                alcoholPercentage: values.alcoholPercentage || null,
                photofileName: values.photo // Ensure this is set correctly
            });
            const response = await fetchPOST('/menu-items', body);
            if (selectedMenuIndex !== null && menus[selectedMenuIndex]) {
                const menuItemId = response.menuItemId;
                const menuId = menus[selectedMenuIndex].menuId;
                const response2 = await fetchPOST(`/menus/${menuId}/items`, JSON.stringify({ itemIds: [menuItemId] }));
                console.log(response2);
                setIsMenuItemPopupOpen(false);
                fetchMenuIemsForSelectedMenu();
            }
        } catch (error) {
            console.error("error while posting new menu item:", error);
        }
    };

    const handleEditMenuItem = (menuItem: MenuItemData) => {
        setEditedMenuItem(menuItem);
        setIsMenuItemEditPopupOpen(true);
    };

    const handleSaveEditedMenuItem = async (values: { [key: string]: string }) => {
        try {
            if (editedMenuItem) {
                const { menuItemId } = editedMenuItem;
                const body = JSON.stringify({
                    name: values.name,
                    price: values.price,
                    alcoholPercentage: values.alcoholPercentage || null,
                    photofileName: values.photo
                });
                console.log(body);
                const response = await fetchPUT(`/menu-items/${menuItemId}`, body);
                console.log(response);
                setIsMenuItemEditPopupOpen(false);

                fetchMenuIemsForSelectedMenu();
            }
        } catch (error) {
            console.error("Error while saving edited menu item:", error);
        }
    };

    const handleDeleteMenuItem = async (menuItem: MenuItemData) => {
        try {
            const { menuItemId } = menuItem;
            const response = await fetchDELETE(`/menu-items/${menuItemId}`);
            console.log(response);
        } catch (error) {
            console.error("Error while deleting menu item:", error);
        }
        fetchMenuIemsForSelectedMenu();
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const editedMenu = editMenu ? {
        name: editMenu.name,
        alternateName: editMenu.alternateName,
        type: editMenu.menuType,
        dateFrom: editMenu.dateFrom,
        dateUntil: editMenu.dateUntil || ""
    } : null;

    const actions = [
        { icon: <EditIcon />, name: 'Edit', onClick: handleEditMenu },
        { icon: <DeleteIcon />, name: 'Delete', onClick: handleDeleteMenu }
    ];

    const filteredMenuItems = selectedMenuIndex !== null ? menus[selectedMenuIndex]?.menuItems.filter((menuItem: MenuItemData) => {
        const nameMatch = menuItem.name.toLowerCase().includes(searchText.toLowerCase());
        const priceMatch = menuItem.price.toString().toLowerCase().includes(searchText.toLowerCase());
        return nameMatch || priceMatch;
    }) : [];

    return (
        <div className="w-full h-full p-2 flex-col space-y-2 bg-white rounded-lg shadow-md">
            <div>
                <div className="flex-end items-ends justify-between">
                    
                    <IconButton onClick={handleMenuOpen} disabled={selectedMenuIndex === null}>
                        {selectedMenuIndex !== null && menus[selectedMenuIndex] && (
                            <MoreActions actions={actions} name={menus[selectedMenuIndex].name} />
                        )}
                    </IconButton>
                </div>
                <div className="flex justify-center">
                    <button
                        className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                        onClick={() => setIsMenuPopupOpen(true)}
                    >
                        <AddIcon />
                    </button>
                    {(activeRestaurantId !== null && menuNamesByRestaurant[activeRestaurantId]) ? (
                        menuNamesByRestaurant[activeRestaurantId].map((category: string, index: number) => (
                            <button
                                key={index}
                                className={`mr-1 rounded-lg p-1 font-bold ${index === selectedMenuIndex ? 'dark:text-black text-white dark:bg-secondary bg-primary-2' : 'border dark:border-secondary dark:text-secondary border-primary-2 text-primary-2'}`}
                                onClick={() => setSelectedMenuIndex(index === selectedMenuIndex ? null : index)}
                            >
                                {category}
                            </button>
                        ))
                    ) : null}
                </div>
            </div>
            <div>
                <button
                    className="mr-1 mx-4 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                    onClick={() => { setIsMenuItemPopupOpen(true) }}
                >
                </button>
                <input
                    type="text"
                    placeholder={t("general.search")}
                    value={searchText}
                    onChange={handleSearchInputChange}
                    className="rounded-lg p-1 dark:text-white dark:bg-grey-3"
                />
            </div>
            <div className="flex flex-wrap m-1">
                {selectedMenuIndex !== null && menus[selectedMenuIndex] && (
                    <>
                        {filteredMenuItems.map((menuItem: MenuItemData) => (
                            <MenuItem
                                key={menuItem.menuItemId}
                                name={menuItem.name}
                                price={menuItem.price}
                                photo={menuItem.photo}
                                alcoholPercentage={menuItem.alcoholPercentage}
                                menuType={menus[selectedMenuIndex].menuType}
                                onDelete={() => handleDeleteMenuItem(menuItem)}
                                onEdit={() => handleEditMenuItem(menuItem)}
                            />
                        ))}
                    </>
                )}
            </div>
            <MenuDialog
                open={isMenuPopupOpen}
                onClose={() => setIsMenuPopupOpen(false)}
                onSave={handleSaveNewMenu}
            />
            <MenuDialog
                open={isEditMenuPopupOpen}
                onClose={() => setIsEditMenuPopupOpen(false)}
                onSave={handleSaveEditedMenu}
                editedMenu={editedMenu}
            />
            <MenuItemDialog
                open={isMenuItemPopupOpen}
                onClose={() => setIsMenuItemPopupOpen(false)}
                onSave={handleSaveNewMenuItem}
                menuType={selectedMenuIndex !== null ? menus[selectedMenuIndex]?.menuType || "" : ""}
            />
            <MenuItemDialog
                open={isMenuItemEditPopupOpen}
                onClose={() => setIsMenuItemEditPopupOpen(false)}
                onSave={handleSaveEditedMenuItem}
                menuType={selectedMenuIndex !== null ? menus[selectedMenuIndex]?.menuType || "" : ""}
                editedMenuItem={editedMenuItem}
            />
        </div>
    );
};

export default MenuManagement;
