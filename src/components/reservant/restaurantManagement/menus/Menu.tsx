import React, { forwardRef, useContext, useState } from 'react'
import { MenuType, MenuItemType } from '../../../../services/types'
import MenuItem from './MenuItem'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { MenuScreenType } from '../../../../services/enums'
import ConfirmationDialog from '../../../reusableComponents/ConfirmationDialog'
import { fetchDELETE } from '../../../../services/APIconn'
import { FetchError } from '../../../../services/Errors'
import MenuItemDialog from './MenuItemDialog'
import Dialog from '../../../reusableComponents/Dialog'
import MenuDialog from './MenuDialog'
import { MenuListContext } from './MenuList'
import { useTranslation } from 'react-i18next'

interface MenuProps {
  menu: MenuType
  type: MenuScreenType
  activeRestaurantId: number
}

const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { menu, type, activeRestaurantId },
  ref
) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
  const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const { fetchMenus } = useContext(MenuListContext)

  const { t } = useTranslation('global')

  const handleDeleteMenu = async () => {
    try {
      const menuId = menu.menuId
      await fetchDELETE(`/menus/${menuId}`)
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error')
      }
    }
  }

  return (
    <div ref={ref}>
      <div className="flex w-full justify-between pr-3">
        <h2 className="font-mont-bd text-xl dark:text-white">{menu.name}</h2>
        {type === MenuScreenType.Management && (
          <div className="flex gap-2">
            <button
              className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-primary p-1 px-2 text-sm text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={() => setIsCreating(true)}
            >
              <AddIcon className="h-4 w-4" />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-primary p-1 px-2 text-sm text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={() => setIsEditingOpen(true)}
            >
              <EditIcon className="h-4 w-4" />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-primary p-1 px-2 text-sm text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={() => setIsConfirmationOpen(true)}
            >
              <DeleteIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 py-2 pr-3">
        {menu.menuItems.map((item: MenuItemType) => (
          <MenuItem
            key={item.menuItemId}
            menuItem={item}
            type={type}
            menu={menu}
            activeRestaurantId={activeRestaurantId}
          />
        ))}
      </div>
      {isEditingOpen && (
        <Dialog
          open={isEditingOpen}
          onClose={() => setIsEditingOpen(false)}
          title={`${t('restaurant-management.menu.editingMenu')}  "${menu.name}" menu...`}
        >
          <MenuDialog
            activeRestaurantId={activeRestaurantId}
            onClose={() => {
              fetchMenus()
              setIsEditingOpen(false)
            }}
            menu={menu}
          />
        </Dialog>
      )}
      {isCreating && (
        <Dialog
          open={isCreating}
          onClose={() => setIsCreating(false)}
          title={`${t('restaurant-management.menu.creatingMenuItem')}..`}
        >
          <MenuItemDialog
            activeRestaurantId={activeRestaurantId}
            onClose={() => {
              fetchMenus()
              setIsCreating(false)
            }}
            menu={menu}
          />
        </Dialog>
      )}
      <ConfirmationDialog
        open={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => {
          handleDeleteMenu()
          fetchMenus()
        }}
        confirmationText={`Are you sure you want to delete ${menu.name}?`} //@TODO translation
      />
    </div>
  )
})

export default Menu
