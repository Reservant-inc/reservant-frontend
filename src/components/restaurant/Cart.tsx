import React, { useContext, useState } from "react";
import OutsideClickHandler from "../reusableComponents/OutsideClickHandler";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext } from "../../contexts/CartContext";
import { getImage } from "../../services/APIconn";
import DefaultImage from "../../assets/images/defaulImage.jpeg"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface CartProps {

}

const Cart: React.FC<CartProps> = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const { items, totalPrice, decrementQuantity, incrementQuantity } = useContext(CartContext)

    return (
        <OutsideClickHandler onOutsideClick={() => setIsOpen(false)} isPressed={isOpen}>
            <div className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center">
                <button 
                    className="w-10 h-10 bg-grey-1 hover:bg-grey-0 dark:bg-grey-5 dark:hover:bg-grey-6 absolute rounded-full"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ShoppingCartIcon className="dark:text-grey-1"/>
                </button>
                {items.length > 0 &&
                    <div className="absolute top-0 right-0 h-4 w-4 dark:text-white bg-primary dark:bg-secondary rounded-full flex items-center justify-center">
                        <h1 className="text-[12px] dark:text-black text-white">{items.length}</h1>
                    </div>    
                }
            </div>
            {isOpen && 
                <div className="absolute top-2 right-14 w-[14rem] h-[20rem] bg-white dark:bg-grey-6 shadow-md rounded-lg flex flex-col items-center py-2 gap-2">
                    <h1 className="text-xl font-mont-bd dark:text-white">Cart</h1>
                    {items.length > 0 ? (
                        <div className="w-full overflow-y-auto scroll h-full flex flex-col divide-solid divide-y divide-grey-1 dark:divide-grey-5 border-y-[1px] border-grey-1 dark:border-grey-5 px-2">
                            {items.map((item, index) => (
                                <div key={item.menuItemId} className="flex py-2 gap-2 items-center font-mont-md dark:text-white">
                                    <img src={getImage(item.photo, DefaultImage)} className="w-[44px] h-[44px] rounded-sm"/>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-1 text-[16px] h-[20px]">
                                            <h1>{item.name}</h1>
                                            <h1>{item.price}zł</h1>
                                        </div>
                                        <div className="flex h-[20px] w-[58px] border-[1px] border-grey-1 dark:border-grey-5 rounded-sm">
                                            <button 
                                                className="bg-grey-1 dark:bg-grey-6 text-black dark:text-white flex items-center justify-center w-[20px] rounded-l-sm"
                                                onClick={() => decrementQuantity(item.menuItemId)}
                                            >
                                                <RemoveIcon className="h-3 w-3"/>
                                            </button>
                                            <div className="flex items-center justify-center w-[20px]">
                                                <h1 className="text-[12px]">{item.quantity}</h1>
                                            </div>
                                            <button 
                                                className="bg-grey-1 dark:bg-grey-6 text-black dark:text-white flex items-center justify-center w-[20px] rounded-r-sm"
                                                onClick={() => incrementQuantity(item.menuItemId)}
                                            >
                                                <AddIcon className="h-3 w-3"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h1 className="h-full w-full flex items-center justify-center text-grey-2">
                            No items in the cart yet
                        </h1>
                    )}
                    
                </div>
            }
        </OutsideClickHandler>
    )
}

export default Cart