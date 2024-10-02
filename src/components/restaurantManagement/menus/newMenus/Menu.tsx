import React, { forwardRef } from 'react';
import { MenuType, MenuItemType } from '../../../../services/types';
import MenuItem from './MenuItem'; // Assuming MenuItem is imported from somewhere

interface MenuProps {
    menu: MenuType;
}

const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu({ menu }, ref) {
    return (
        <div ref={ref}>
            <h2 className='text-xl dark:text-white font-mont-bd'>{menu.name}</h2>
            <div className='flex flex-col gap-2 py-2 pr-3'>
                {menu.menuItems.map((item: MenuItemType) => (
                    <MenuItem key={item.menuItemId} menuItem={item} />
                ))}
            </div>
        </div>
    );
});

export default Menu;
