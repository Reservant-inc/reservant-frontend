import React from "react";
import { useLocation } from "react-router-dom";
import { CartItemType } from "../../services/types";
import { getImage } from "../../services/APIconn";
import DefaultImage from "../../assets/images/defaulImage.jpeg"

const Checkout: React.FC = () => {
    const { state } = useLocation();
    const { items } = state as { items: CartItemType[] };
    
    return (
        <div className="checkout-container">
            <h1 className="text-xl font-mont-bd dark:text-white">Checkout</h1>
            {items.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <div key={item.menuItemId} className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <img
                                src={getImage(item.photo, DefaultImage)}
                                alt={item.name}
                                className="w-[50px] h-[50px] rounded-sm"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-lg font-bold">{item.name}</h1>
                                <h2>{item.price} zł</h2>
                                <h3>Quantity: {item.quantity}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <h2>No items in the cart.</h2>
            )}
        </div>
    );
};

export default Checkout;
