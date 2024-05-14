import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MenuPopup, { MenuItemInterface } from "./MenuPopup";
import { useTranslation } from "react-i18next";
import { fetchDELETE, fetchGET, fetchPOST, fetchPUT } from "../../../services/APIconn";
import MenuItem from "./MenuItem";
import MyModal from "../../reusableComponents/MyModal";

interface MenuManagementProps {
    activeRestaurantId: number | null;
}

interface Menu {
    id: number;
    name: string;
    alternateName: string
    menuType: string;
    dateFrom: string;
    dateUntil: string | null;
    menuItems: MenuItemData[];
}

interface MenuItemData {
    id: number;
    name: string;
    price: number;
    alcoholPercentage: number;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ activeRestaurantId }) => {
    const { t } = useTranslation("global");

    const [menus, setMenus] = useState<any[]>([]);
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
            fetchMenus(activeRestaurantId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRestaurantId]);

    useEffect (() => {
        fetchMenuIemsForSelectedMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMenuItemEditPopupOpen, isMenuItemPopupOpen])
    
    useEffect(() => {
        const isMenuFetched = selectedMenuIndex !== null && menus.length > selectedMenuIndex && menus[selectedMenuIndex].menuItems.length > 0;

    if (!isMenuFetched) {
        fetchMenuIemsForSelectedMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menus, selectedMenuIndex, setIsMenuItemEditPopupOpen]);

    const fetchMenuIemsForSelectedMenu = async () => {
        if (selectedMenuIndex !== null && menus.length > selectedMenuIndex) {
            const menuId = menus[selectedMenuIndex].id;
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
    

    const handleEditMenu = () => {
        if (selectedMenuIndex !== null && menuNamesByRestaurant[activeRestaurantId || 0]) {
            const selectedMenu = menus[selectedMenuIndex];
            setEditMenu(selectedMenu);
            setIsEditMenuPopupOpen(true);
        }
    };
    const handleSaveNewMenu = async (values: { [key: string]: string }) => {

        const body = JSON.stringify({ restaurantId: activeRestaurantId, name: values.Name, alternateName: values["Alternate name"], 
        menuType: values.Type});  //dodać dodawanie dat i nie wiem o co chodzi z alternate name
        try {
            const response = await fetchPOST('/menus', body);
            console.log("Response:", response);

            setIsMenuPopupOpen(false);

            if (activeRestaurantId !== null) {
                fetchMenus(activeRestaurantId);
            }
        } catch (error) {
            console.error("Error saving new category:", error);
        }
    };
    

    const handleSaveEditedMenu = async (values: { [key: string]: string }) => {
        
        if (selectedMenuIndex !== null && menuNamesByRestaurant[activeRestaurantId || 0]) {
            const body = JSON.stringify({ name: values.Name, alternateName: values["Alternate name"], 
            menuType: values.Type});  //dodać dodawanie dat i nie wiem o co chodzi z alternate name

            try {
                const menuId = menus[selectedMenuIndex].id;
                const response = await fetchPUT(`/menus/${menuId}` , body);
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
                const menuId = menus[selectedMenuIndex].id;
                const response = await fetchDELETE(`/menus/${menuId}`);
                console.log(response); 
                // Zresetuj indeks wybranego menu
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
            const body = JSON.stringify({ restaurantId: activeRestaurantId, name: values.Name, price: values.Price, alcoholPercentage: values["Alcohol percentage"]});
            const response = await fetchPOST('/menu-items' , body);
            console.log("Response:", response);
            if (selectedMenuIndex !== null && menus[selectedMenuIndex]) { // warunek sprawdzający, czy selectedMenuIndex nie jest null
                const menuItemId = response.id;
                const menuId = menus[selectedMenuIndex].id;
                const response2 = await fetchPOST(`/menus/${menuId}/items` , JSON.stringify({ itemIds: [menuItemId]}));
                console.log(response2);
                setIsMenuItemPopupOpen(false);
            }
        }catch (error) {
            console.error("error while posting new menu item:", error)
        }

    };

    const handleEditMenuItem = (menuItem: MenuItemData) => {
        setEditedMenuItem(menuItem);
        setIsMenuItemEditPopupOpen(true);
    };

    const handleSaveEditedMenuItem = async (values: { [key: string]: string }) => {
        try {
            if (editedMenuItem) {
                const { id } = editedMenuItem;
                console.log(values);
                const body = JSON.stringify({ name: values.Name, price: values.Price, alcoholPercentage: values["Alcohol percentage"]});
                const response = await fetchPUT(`/menu-items/${id}`, body);
                console.log(response);
                setIsMenuItemEditPopupOpen(false);
            }
        } catch (error) {
            console.error("Error while saving edited menu item:", error);
        }
    };


    const handleDeleteMenuItem = async (menuItem: MenuItemData) => {
        try {
            const { id } = menuItem;
            const response = await fetchDELETE(`/menu-items/${id}`);
            console.log(response);
        } catch (error) {
            console.error("Error while deleting menu item:", error);
        }
        fetchMenuIemsForSelectedMenu(); //usuwa się ale jest ten błąd SyntaxError: The string did not match the expected pattern. 
                                        //ostatni element nie znika od razu
    };
    

    const menu: MenuItemInterface[] = [
        {
            header: t("restaurant-management.menu.name"),
        },
        {
            header: t("restaurant-management.menu.alternateName"),
        },
        {
            header: t("restaurant-management.menu.type"),
        },
        {
            header: t("restaurant-management.menu.dateFrom"),
        },
        {
            header: t("restaurant-management.menu.dateUntil"),
        }

    ];

    const editedMenu: MenuItemInterface[] = [
        {
            header: t("restaurant-management.menu.name"),
            initialValue: editMenu?.name || "" 
        },
        {
            header: t("restaurant-management.menu.alternateName"),
            initialValue: editMenu?.alternateName || "" 
        },
        {
            header: t("restaurant-management.menu.type"),
            initialValue: editMenu?.menuType || "" 
        },
        {
            header: t("restaurant-management.menu.dateFrom"),
            initialValue: editMenu?.dateFrom || "" 
        },
        {
            header: t("restaurant-management.menu.dateUntil"),
            initialValue: editMenu?.dateUntil || ""
        }
        
    ];

    const menuItems: MenuItemInterface[] = [
    {
        header: t("restaurant-management.menu.menuItemName")
    },
    {
        header: t("restaurant-management.menu.menuItemPrice")
    },
    {
        header: t("restaurant-management.menu.menuItemAlcoholPercentage")
    }
];
const editedMenuItems: MenuItemInterface[] = [
    {
        header: t("restaurant-management.menu.menuItemName"),
        initialValue: editedMenuItem?.name || ""
    },
    {
        header: t("restaurant-management.menu.menuItemPrice"),
        initialValue: editedMenuItem?.price.toString() || ""
    },
    {
        header: t("restaurant-management.menu.menuItemAlcoholPercentage"),
       initialValue: editedMenuItem?.alcoholPercentage?.toString() || ""
    }
];

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    };

    const filteredMenuItems = selectedMenuIndex !== null ? menus[selectedMenuIndex]?.menuItems.filter((menuItem: MenuItemData) => {
        const nameMatch = menuItem.name.toLowerCase().includes(searchText.toLowerCase());
        const priceMatch = menuItem.price.toString().toLowerCase().includes(searchText.toLowerCase());
        return nameMatch || priceMatch;
    }) : [];
    
   
    return (
        <div className="w-full h-full p-2  flex-col space-y-2">
            <div className="flex items-center justify-center">
                <button
                    className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                    onClick={() => setIsMenuPopupOpen(true)}
                >
                    <AddIcon />
                </button>
                <button
                    className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                    onClick={handleEditMenu}
                    disabled={selectedMenuIndex === null}
                >
                    <EditIcon />
                </button>
                <button
                    className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                    onClick={handleDeleteMenu}
                    disabled={selectedMenuIndex === null}
                >
                    <DeleteIcon />
                </button>

               {(activeRestaurantId !== null && menuNamesByRestaurant[activeRestaurantId]) ? (
                    menuNamesByRestaurant[activeRestaurantId].map((category: string, index: number) => (
                        <button
                            key={index}
                            className={`mr-1 rounded-lg p-1 dark:text-black ${index === selectedMenuIndex ? 'dark:bg-secondary' : 'dark:bg-secondary-2'}`}
                            onClick={() => setSelectedMenuIndex(index === selectedMenuIndex ? null : index)}
                        >
                            {category}
                        </button>
                    ))
                ) : null}

                <MyModal open={isMenuPopupOpen} onClose={() => setIsMenuPopupOpen(false)}>
                    <MenuPopup 
                    items={menu} 
                    mainHeader={t("restaurant-management.menu.addNewMenu")}
                    onSave={handleSaveNewMenu} 
                    onClose={() => setIsMenuPopupOpen(false)} />
                </MyModal>

                <MyModal open={isEditMenuPopupOpen} onClose={() => setIsEditMenuPopupOpen(false)}>
                    <MenuPopup
                        items={editedMenu}
                        mainHeader={t("restaurant-management.menu.editMenu")}
                        onSave={handleSaveEditedMenu}
                        onClose={() => setIsEditMenuPopupOpen(false)}
                    />
                </MyModal>
                
                <MyModal open={isMenuItemPopupOpen} onClose={() => setIsMenuItemPopupOpen(false)}>
                    <MenuPopup
                        items={menuItems}
                        mainHeader={t("restaurant-management.menu.addNewMenuItem")}
                        onClose={() => setIsMenuItemPopupOpen(false)}
                        onSave= {handleSaveNewMenuItem}
                    />
                </MyModal>
            
                <MyModal open={isMenuItemEditPopupOpen} onClose={() => {setIsMenuItemEditPopupOpen(false)}}>
                    <MenuPopup
                        items={editedMenuItems}
                        mainHeader={t("restaurant-management.menu.editMenuItem")}
                        onClose={() => {
                            setIsMenuItemEditPopupOpen(false);
                        }}
                        onSave={handleSaveEditedMenuItem}
                    />
                </MyModal>
            </div>
            <div>
                <button
                    className="mr-1 rounded-lg bg-primary-2 p-1 w-8 h-8 dark:bg-secondary-2 dark:hover:bg-secondary dark:text-black"
                    onClick={() => {setIsMenuItemPopupOpen(true)}}
                >
                    <AddIcon />
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={handleSearchInputChange}
                    className="rounded-lg p-1 dark:text-black"
                />
            </div>
                <div className="flex flex-wrap m-1">
                    {selectedMenuIndex !== null && menus[selectedMenuIndex] && (
                        <>
                            {filteredMenuItems.map((menuItem: MenuItemData) => (
                                <MenuItem 
                                    key={menuItem.id} 
                                    name={menuItem.name} 
                                    price={menuItem.price} 
                                    alcoholPercentage={menuItem.alcoholPercentage} 
                                    menuType={menus[selectedMenuIndex].menuType}
                                    onDelete={() => handleDeleteMenuItem(menuItem)} 
                                    onEdit={() => handleEditMenuItem(menuItem)}
                                />
                            ))}
                         </>
                    )}
                </div>
        </div>
    );
};

export default MenuManagement;
