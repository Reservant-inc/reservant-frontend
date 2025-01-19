import React, { useContext, useEffect, useState } from 'react'
import {
  IngredientType,
  MenuItemType,
  ItemWithIngredientsType,
  MenuType
} from '../../../../services/types'
import { FetchError } from '../../../../services/Errors'
import { fetchDELETE, fetchGET, getImage } from '../../../../services/APIconn'
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'
import { MenuScreenType } from '../../../../services/enums'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { CartContext } from '../../../../contexts/CartContext'
import AddIcon from '@mui/icons-material/Add'
import ConfirmationDialog from '../../../reusableComponents/ConfirmationDialog'
import { useTranslation } from 'react-i18next'
import Dialog from '../../../reusableComponents/Dialog'
import MenuItemDialog from './MenuItemDialog'
import { MenuListContext } from './MenuList'

interface MenuItemProps {
  menuItem: MenuItemType
  type: MenuScreenType
  menu?: MenuType
  activeRestaurantId: number
}

const MenuItem: React.FC<MenuItemProps> = ({
  menuItem,
  type,
  menu,
  activeRestaurantId
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
  const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false)

  const { t } = useTranslation('global')
  const { fetchMenus } = useContext(MenuListContext)
  const { addToCart } = useContext(CartContext)

  const [item, setItem] = useState<ItemWithIngredientsType>({
    ...menuItem,
    ingredients: []
  })

  useEffect(() => {
    fetchIngredients()
  }, [isEditingOpen])

  const fetchIngredients = async () => {
    try {
      const menuInfo = await fetchGET(`/menu-items/${menuItem.menuItemId}`)

      const ingredients: IngredientType[] = menuInfo.ingredients

      setItem({ ...menuItem, ingredients })
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error')
      }
    }
  }

  const handleRemoveMenuItem = async () => {
    try {
      const { menuItemId } = menuItem
      const body = JSON.stringify({
        itemIds: [menuItemId]
      })
      await fetchDELETE(`/menus/${menu?.menuId}/items`, body)
      fetchMenus()
      setIsConfirmationOpen(false)
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error')
      }
    }
  }

  const handleDeletePermanentlyMenuItem = async () => {
    try {
      const { menuItemId } = menuItem
      await fetchDELETE(`/menu-items/${menuItemId}`)
      fetchMenus()
      setIsConfirmationOpen(false)
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error')
      }
    }
  }

  return (
    <>
      <div
        className="relative flex w-full gap-2 rounded-lg border-[1px] border-grey-1 p-4 dark:border-grey-5"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={getImage(menuItem.photo, DefaultImage)}
          className="h-16 w-16 rounded-lg"
        />
        <div className="flex flex-col">
          <div className="flex gap-3">
            <h1 className="text-md dark:text-white">{menuItem.name}</h1>
            <h1 className="text-md dark:text-white">{menuItem.price} zł</h1>
          </div>
          {menuItem.alternateName && (
            <h1 className="text-sm text-grey-3">{menuItem.alternateName}</h1>
          )}
          <div className="flex gap-1">
            {item.ingredients.map((ingredient, index) => (
              <h1 key={index} className="text-sm text-grey-3">
                {ingredient.publicName}
                {index !== item.ingredients.length - 1 && ','}
              </h1>
            ))}
          </div>
          {menuItem.alcoholPercentage !== 0 && (
            <h1 className="text-sm text-grey-3">
              {t('restaurant-management.menu.menuItemAlcoholPercentage')} - {menuItem.alcoholPercentage}%
            </h1>
          )}
        </div>
        {isHovering && type === MenuScreenType.Management && (
          <div className="absolute right-2 top-2 flex gap-2">
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
        {type === MenuScreenType.Order && (
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-primary p-1 px-2 text-sm text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={() =>
                addToCart({
                  menuItemId: item.menuItemId,
                  name: item.name,
                  price: item.price,
                  photo: item.photo,
                  amount: 1
                })
              }
            >
              <AddIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {isEditingOpen && (
        <Dialog
          open={isEditingOpen}
          onClose={() => setIsEditingOpen(false)}
          title={`Editing ${menuItem.name}...`}
        >
          <MenuItemDialog
            menu={menu}
            menuItemToEdit={menuItem}
            activeRestaurantId={activeRestaurantId}
            onClose={() => {
              fetchMenus()
              setIsEditingOpen(false)
            }}
          />
        </Dialog>
      )}
      <ConfirmationDialog
        open={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleRemoveMenuItem}
        onAlt={handleDeletePermanentlyMenuItem}
        confirmationText={`Are you sure you want to remove ${menuItem.name} from this menu?`} //@TODO translation
        altText={t('alt.delete')}
      />
    </>
  )
}

export default MenuItem
