import React, { useContext, useState } from 'react'
import { CartContext } from '../../../contexts/CartContext'
import { getImage } from '../../../services/APIconn'
import DefaultImage from '../../../assets/images/no-image.png'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useTranslation } from 'react-i18next'

interface CartProps {}

const Cart: React.FC<CartProps> = () => {
  const { items, decrementQuantity, incrementQuantity } =
    useContext(CartContext)
  const [t] = useTranslation('global')

  return (
    <div className="flex flex-col w-full h-full items-center gap-2 rounded-lg bg-white dark:bg-black py-2 dark:bg-grey-6">
      <h1 className="font-mont-bd text-xl dark:text-white">{t('cart.cart')}</h1>
      {items.length > 0 ? (
        <div className="scroll flex h-full w-full flex-col divide-y divide-solid divide-grey-1 overflow-y-auto border-y-[1px] border-grey-1 px-2 dark:divide-grey-5 dark:border-grey-5">
          {items.map(item => (
            <div
              key={item.menuItemId}
              className="flex items-center gap-2 py-2 font-mont-md dark:text-white"
            >
              <img
                src={getImage(item.photo, DefaultImage)}
                className="h-[44px] w-[44px] rounded-sm"
              />
              <div className="flex flex-col gap-1">
                <div className="flex h-[20px] gap-1 text-[16px]">
                  <h1>{item.name}</h1>
                  <h1>{item.price}zł</h1>
                </div>
                <div className="flex h-[20px] w-[58px] rounded-sm border-[1px] border-grey-1 dark:border-grey-5">
                  <button
                    className="flex w-[20px] items-center justify-center rounded-l-sm bg-grey-1 text-black dark:bg-grey-6 dark:text-white"
                    onClick={() => decrementQuantity(item.menuItemId)}
                  >
                    <RemoveIcon className="h-3 w-3" />
                  </button>
                  <div className="flex w-[20px] items-center justify-center">
                    <h1 className="text-[12px]">{item.amount}</h1>
                  </div>
                  <button
                    className="flex w-[20px] items-center justify-center rounded-r-sm bg-grey-1 text-black dark:bg-grey-6 dark:text-white"
                    onClick={() => incrementQuantity(item.menuItemId)}
                  >
                    <AddIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="flex h-full w-full items-center justify-center text-grey-2">
          {t('cart.no-items')}
        </h1>
      )}
    </div>
  )
}

export default Cart
