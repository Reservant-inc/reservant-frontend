import React, { useEffect, useState } from "react";
import { MenuItemType } from "../../../../services/types";
import { FetchError } from "../../../../services/Errors";
import { fetchGET, getImage } from "../../../../services/APIconn";
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'
import { MenuScreenType } from "../../../../services/enums";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface MenuItemProps {
  menuItem: MenuItemType
  type: MenuScreenType
}

const MenuItem: React.FC<MenuItemProps> = ({ menuItem, type }) => {

  const [isHovering, setIsHovering] = useState<boolean>(false)

  const [ingredients, setIngredients] = useState<{
    ingredientId: number,
    publicName: string,
    amountUsed: number
  }[]>([])

  useEffect(() => {
    fetchIngredients()
  }, [])
  
  const fetchIngredients = async () => {
    try {

      const menuInfo = await fetchGET(
        `/menu-items/${menuItem.menuItemId}`,
      )

      setIngredients(menuInfo.ingredients)

    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("Unexpected error")
      }
    }
  };

  return (
    <div className="relative flex gap-2 w-full p-4 border-[1px] border-grey-1 dark:border-grey-5 rounded-lg" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <img src={getImage(menuItem.photo, DefaultImage)} className="w-24 h-24 rounded-lg"/>
      <div className="flex flex-col gap-1">
        <div className="flex gap-3">
          <h1 className="dark:text-white text-lg h-[22px]">{menuItem.name}</h1>
          <h1 className="dark:text-white text-lg h-[22px]">{menuItem.price} zł</h1>
        </div>
        {menuItem.alternateName && <h1 className="text-grey-3 h-[20px]">{menuItem.alternateName}</h1>}
        <div className="flex gap-1">
          {ingredients.map((ingredient, index) => (
            <h1 key={ingredient.ingredientId} className="text-grey-3 h-[20px]">{ingredient.publicName}{index !== ingredients.length-1 && ','}</h1>
          ))} 
        </div>
        {menuItem.alcoholPercentage !== 0 && <h1 className="text-grey-3 h-[20px]">alcohol contents - {menuItem.alcoholPercentage}%</h1>}
      </div>
      {
        (isHovering && type === MenuScreenType.Management) && 
        <div className="absolute top-2 right-2 flex gap-2">
          <button className='flex items-center justify-center p-1 px-2 h-6 w-6 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm'>
              <EditIcon className='h-4 w-4'/>
          </button>
          <button className='flex items-center justify-center p-1 px-2 h-6 w-6 rounded-full border-[1px] border-primary text-primary hover:bg-primary dark:border-secondary dark:hover:bg-secondary dark:text-secondary dark:hover:text-black hover:text-white text-sm'>
              <DeleteIcon className='h-4 w-4'/>
          </button>
        </div>
      }
    </div>
  );
};

export default MenuItem;
