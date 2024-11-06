import React, { useContext, useState } from 'react'
import OutsideClickHandler from '../reusableComponents/OutsideClickHandler'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { CartContext } from '../../contexts/CartContext'
import { getImage } from '../../services/APIconn'
import DefaultImage from '../../assets/images/defaulImage.jpeg'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

interface CartProps {}

const Cart: React.FC<CartProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { items, decrementQuantity, incrementQuantity } =
    useContext(CartContext)

  return (
    <OutsideClickHandler
      onOutsideClick={() => setIsOpen(false)}
      isPressed={isOpen}
    >
      <div className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center">
        <button
          className="absolute h-10 w-10 rounded-full bg-grey-1 hover:bg-grey-0 dark:bg-grey-5 dark:hover:bg-grey-6"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ShoppingCartIcon className="dark:text-grey-1" />
        </button>
        {items.length > 0 && (
          <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary dark:bg-secondary dark:text-white">
            <h1 className="text-[12px] text-white dark:text-black">
              {items.length}
            </h1>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="absolute right-14 top-2 flex h-[20rem] w-[14rem] flex-col items-center gap-2 rounded-lg bg-white py-2 shadow-md dark:bg-grey-6">
          <h1 className="font-mont-bd text-xl dark:text-white">Cart</h1>
          {items.length > 0 ? (
            <div className="scroll flex h-full w-full flex-col divide-y divide-solid divide-grey-1 overflow-y-auto border-y-[1px] border-grey-1 px-2 dark:divide-grey-5 dark:border-grey-5">
              {items.map((item, index) => (
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
              No items in the cart yet
            </h1>
          )}
        </div>
      )}
    </OutsideClickHandler>
  )
}

export default Cart
