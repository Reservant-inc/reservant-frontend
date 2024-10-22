import React, { useContext, useEffect, useRef, useState } from 'react'
import {  MenuType } from '../../../../services/types';
import { fetchGET } from '../../../../services/APIconn';
import { FetchError } from '../../../../services/Errors';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Menu from './Menu';
import AddIcon from '@mui/icons-material/Add';
import { MenuScreenType } from '../../../../services/enums';
import Dialog from "../../../reusableComponents/Dialog";
import MenuDialog from '../MenuDialog';

interface MenuListProps {
    activeRestaurantId: number
    type: MenuScreenType
}
interface MenuListContextProps {
  fetchMenus: () => Promise<void>
}
export const MenuListContext = React.createContext<MenuListContextProps>({fetchMenus: async () => {}})

const MenuList: React.FC<MenuListProps> = ({ activeRestaurantId, type }) => {

    const [menus, setMenus] = useState<MenuType[]>([])
    const [menuIndex, setMenuIndex] = useState<number>(0)

    const [isCreating, setIsCreating] = useState<boolean>(false)

    const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

    const scrollToMenu = () => {
      const menuElement = menuRefs.current[menuIndex];
  
      if (menuElement) {
        menuElement.scrollIntoView()
      }
    };

    useEffect(() => {
        fetchMenus()
    }, [])

    useEffect(() => {
      scrollToMenu()
    }, [menuIndex])

    const fetchMenus = async () => {
      try {
  
        const menus: MenuType[] = await fetchGET(
          `/restaurants/${activeRestaurantId}/menus`,
        )
        
        const completeMenus = await Promise.all(
          menus.map(async (menu) => {
            const response = await fetchGET(`/menus/${menu.menuId}`);
            return response;
          })
        );

        setMenus(completeMenus)

      } catch (error) {
        if (error instanceof FetchError) {
          console.log(error.formatErrors())
        } else {
          console.log("Unexpected error")
        }
      }
    };

    return (
      <MenuListContext.Provider value={{fetchMenus}}>
        <div className='w-full h-full flex flex-col gap-2'>
            <div className='flex gap-2 h-16 w-full justify-between'>
              <button className='h-8 min-w-8 rounded-full bg-grey-0 hover:bg-grey-1 dark:bg-grey-6 dark:hover:bg-grey-5' onClick={() => menuIndex === 0 ? setMenuIndex(menus.length - 1) : setMenuIndex((index) => index - 1)}>
                <ChevronLeftIcon className='w-6 h-6 dark:text-white'/>
              </button>
              <div className='flex gap-2 overflow-x-auto scroll whitespace-nowrap'>
                {menus.map((menu, index) => (
                    <button 
                      key={menu.menuId + menu.name} 
                      onClick={() => setMenuIndex(index)}
                      className={`p-1 px-2 h-8 text-sm rounded-full flex-shrink-0 ${menuIndex === index ? 'bg-primary text-white dark:bg-secondary dark:text-black' : 'dark:text-white bg-grey-0 hover:bg-grey-1 dark:bg-grey-6 dark:hover:bg-grey-5'} `}
                    >
                        {menu.name}
                    </button>
                ))}
              </div>
              <div className='flex gap-2'>
                <button className='h-8 min-w-8 rounded-full bg-grey-0 hover:bg-grey-1 dark:bg-grey-6 dark:hover:bg-grey-5' onClick={() => menuIndex === (menus.length - 1) ? setMenuIndex(0) : setMenuIndex((index) => index + 1)}>
                  <ChevronRightIcon className='w-6 h-6 dark:text-white'/>
                </button>  
                { 
                type === MenuScreenType.Management &&
                  <button 
                    className='flex items-center justify-center p-1 px-2 h-8 w-8 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm'
                    onClick={()=>setIsCreating(true)}
                  >
                    <AddIcon className='h-6 w-6'/>
                  </button>
                }
              </div>
            </div>
            <div className='overflow-y-auto scroll h-full flex flex-col gap-5 scroll-smooth'>
                {menus.map((menu, index) => (
                    <Menu key={menu.menuId + menu.name} menu={menu} activeRestaurantId={activeRestaurantId} ref={(el) => (menuRefs.current[index] = el)} type={type}/>
                ))}
            </div>
            {isCreating && 
              <Dialog
                open={isCreating}
                onClose={()=>setIsCreating(false)}
                title={`Creating a new menu...`} //@TODO translation
              >
                <MenuDialog
                  activeRestaurantId={activeRestaurantId}
                  onClose={()=>{
                    fetchMenus()
                    setIsCreating(false)
                  }}
                />
              </Dialog>
            }
        </div>
      </MenuListContext.Provider>

    )
}

export default MenuList