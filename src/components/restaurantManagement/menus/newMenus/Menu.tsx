import React, { forwardRef } from 'react';
import { MenuType, MenuItemType } from '../../../../services/types';
import MenuItem from './MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MenuScreenType } from '../../../../services/enums';

interface MenuProps {
    menu: MenuType;
    type: MenuScreenType
    activeRestaurantId: number
}

const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu({ menu, type, activeRestaurantId }, ref) {
    return (
        <div ref={ref}>
            <div className='w-full flex justify-between pr-3'>
                <h2 className='text-xl dark:text-white font-mont-bd'>{menu.name}</h2>
                {type === MenuScreenType.Management &&
                    <div className='flex gap-2'>
                        <button 
                            className='flex items-center justify-center p-1 px-2 h-6 w-6 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm'
                            onClick={()=>{
                                //@todo menu edit
                            }}                        
                        >
                            <EditIcon className='h-4 w-4'/>
                        </button>
                        <button 
                            className='flex items-center justify-center p-1 px-2 h-6 w-6 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm'
                            onClick={()=>{
                                //@todo menu deletion
                            }}
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
        </div>
    );
});

export default Menu;
