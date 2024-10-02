import React, { useEffect, useState } from "react";
import { MenuItemType } from "../../../../services/types";
import { FetchError } from "../../../../services/Errors";
import { fetchGET, getImage } from "../../../../services/APIconn";
import DefaultImage from '../../../../assets/images/defaulImage.jpeg'

interface MenuItemProps {
  menuItem: MenuItemType
}

const MenuItem: React.FC<MenuItemProps> = ({ menuItem }) => {

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
    <div className="flex gap-2 w-full p-4 border-[1px] border-grey-1 dark:border-grey-5 rounded-lg">
      <img src={getImage(menuItem.photo, DefaultImage)} className="w-20 h-20 rounded-lg"/>
      <div className="flex flex-col gap-2">
        <h1 className="dark:text-white text-lg">{menuItem.name}</h1>
      </div>
    </div>
  );
};

export default MenuItem;
