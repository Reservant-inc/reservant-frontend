import React, { forwardRef, useContext, useState } from 'react';
import { MenuType, MenuItemType } from '../../../../services/types';
import MenuItem from './MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { MenuScreenType } from '../../../../services/enums';
import ConfirmationDialog from '../../../reusableComponents/ConfirmationDialog';
import { fetchDELETE } from '../../../../services/APIconn';
import { FetchError } from '../../../../services/Errors';
import MenuItemDialog from '../MenuItemDialog';
import Dialog from '../../../reusableComponents/Dialog';
import MenuDialog from '../MenuDialog';
import { MenuListContext } from './MenuList';

interface MenuProps {
    menu: MenuType;
    type: MenuScreenType
    activeRestaurantId: number

}

const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu({ menu, type, activeRestaurantId}, ref) {

    const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
    const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const { fetchMenus } = useContext(MenuListContext)

    const handleDeleteMenu = async () => {
        try {
            const menuId = menu.menuId; 
            const response = await fetchDELETE(`/menus/${menuId}`);
            console.log(response);
            setIsConfirmationOpen(false)
        }
        catch (error) {
          if (error instanceof FetchError) {
            console.log(error.formatErrors())
          } else {
            console.log("Unexpected error")
          }
        };
    }
    
    return (
        <div ref={ref}>
            <div className='w-full flex justify-between pr-3'>
                <h2 className='text-xl dark:text-white font-mont-bd'>{menu.name}</h2>
                {type === MenuScreenType.Management &&
                    <div className='flex gap-2'>
                        <button 
                            className='flex items-center justify-center p-1 px-2 h-6 w-6 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm'
                            onClick={()=>setIsCreating(true)}                        
                        >
                            <AddIcon className='h-4 w-4'/>
                        </button>
                        <button 
                            className='flex items-center justify-center p-1 px-2 h-6 w-6 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm'
                            onClick={()=>setIsEditingOpen(true)}                        
                        >
                            <EditIcon className='h-4 w-4'/>
                        </button>
                        <button 
                            className='flex items-center justify-center p-1 px-2 h-6 w-6 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm'
                            onClick={()=>setIsConfirmationOpen(true)}
                        >
                            <DeleteIcon className='h-4 w-4'/>
                        </button>
                    </div>
                }
            </div>
            <div className='flex flex-col gap-2 py-2 pr-3'>
                {menu.menuItems.map((item: MenuItemType) => (
                    <MenuItem key={item.menuItemId} menuItem={item} type={type} menu={menu} activeRestaurantId={activeRestaurantId}/>
                ))}
            </div>
            {isEditingOpen && 
              <Dialog
                open={isEditingOpen}
                onClose={()=>setIsEditingOpen(false)}
                title={`Editing the "${menu.name}" menu...`} //@TODO translation
              >
                <MenuDialog
                  activeRestaurantId={activeRestaurantId}
                  onClose={()=>{
                    fetchMenus()
                    setIsEditingOpen(false)
                  }}
                  menu={menu}
                />
              </Dialog>
            }
             {isCreating && 
              <Dialog
                open={isCreating}
                onClose={()=>setIsCreating(false)}
                title={`Creating new menu item...`} //@TODO translation
              >
                <MenuItemDialog
                  activeRestaurantId={activeRestaurantId}
                  onClose={()=>{
                    fetchMenus()
                    setIsCreating(false);
                  }}
                  menu={menu}
                />
              </Dialog>
            }
            <ConfirmationDialog
                open={isConfirmationOpen}
                onClose={()=>setIsConfirmationOpen(false)}
                onConfirm={()=>{
                  handleDeleteMenu();
                  fetchMenus();
                }}
                confirmationText={`Are you sure you want to delete ${menu.name}?`} //@TODO translation
            />
        </div>
    );
});

export default Menu;
