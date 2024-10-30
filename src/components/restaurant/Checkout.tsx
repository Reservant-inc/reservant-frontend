import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CartItemType, RestaurantDetailsType } from "../../services/types";
import { fetchPOST, getImage } from "../../services/APIconn";
import DefaultImage from "../../assets/images/defaulImage.jpeg"
import Cookies from "js-cookie";
import { FetchError } from "../../services/Errors";

const Checkout: React.FC = () => {
    const { state } = useLocation();
    const { items, totalPrice, guests, date, restaurant } = state as { items: CartItemType[], totalPrice: number, guests: number, date: string, restaurant: RestaurantDetailsType };
    const userInfo = Cookies.get('userInfo');
    const user = userInfo ? JSON.parse(userInfo) : null;   
    
    const onSubmit = async () => {
        let res;
        try {
            const body = JSON.stringify(
                {
                     date :  date ,
                     endTime :  "" ,
                     numberOfGuests : guests,
                     tip : 0,
                     takeaway : false,
                     restaurantId : restaurant.restaurantId,
                     participantIds : [
                         user.userId 
                    ]
                },
            );
            res = await fetchPOST(
              `/visits`,
              body,
            );
            alert("visit created")
        } catch (error) {
            if (error instanceof FetchError) 
                console.log(error.formatErrors())
            else 
                console.log("Unexpected error")
        }
        if(items.length > 0 && res){
            try {
                const body = JSON.stringify(
                    {
                        visitId: res.visitId,
                        note: "",
                        items: items
                    },
                );
                await fetchPOST(
                  `/visits`,
                  body,
                );
                alert("order created")
            } catch (error) {
                if (error instanceof FetchError) 
                    console.log(error.formatErrors())
                else 
                    console.log("Unexpected error")
            }
        }
    }

    return (
        <div className="checkout-container flex flex-col items-center gap-7 p-10 h-full w-full">
            <h1 className="text-xl font-mont-bd dark:text-white">Checkout</h1>
            <div className="flex justify-center w-full h-full gap-14">
                <div className="flex flex-col h-full w-1/4 gap-10">
                    <div className="w-full flex h-2/6 flex-col gap-7 p-5 border-grey-1 border-[1px] rounded-lg">
                        <h1 className="self-center text-xl font-mont-bd dark:text-white">User details</h1>
                        <span className="flex justify-between">
                            <label>First name:</label>
                            <label>{user.firstName}</label>
                        </span>
                        <span className="flex justify-between">
                            <label>Last name:</label>
                            <label>{user.lastName}</label>
                        </span>
                    </div>   
                    <div className="w-full flex h-3/6 flex-col gap-7 p-5 border-grey-1 border-[1px] rounded-lg">
                        <h1 className="self-center text-xl font-mont-bd dark:text-white">Reservation details</h1>
                        <span className="flex justify-between">
                            <label>Number of guests:</label>
                            <label>{guests}</label>
                        </span>
                        <span className="flex justify-between">
                            <label>Date of reservation:</label>
                            <label>{date}</label>
                        </span>
                        <span className="flex justify-between">
                            <label>Total cost:</label>
                            <label>{restaurant.reservationDeposit?restaurant.reservationDeposit:0 + totalPrice} zł</label>
                        </span>
                    </div>   
                    <button className="h-1/6 px-7 self-center rounded-lg border-[1px] border-grey-1 shadow-lg hover:text-primary" onClick={()=>{}}> Proceed to payment</button>
                </div>
                {items.length > 0 &&
                    <div className="w-1/4 flex gap-10 h-full flex-col">
                        <div className="flex flex-col p-5 h-2/3 border-grey-1 border-[1px] rounded-lg">
                            <h1 className="self-center text-xl font-mont-bd dark:text-white">Order details</h1>
                            <div className="flex flex-col gap-4 w-full separator divide-y-[1px] ">
                                {items.map((item) => (
                                    <div key={item.menuItemId} className=" flex items-center gap-4 p-4 ">
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
                        </div>
                        <div className="flex flex-col h-1/3 p-5 border-grey-1 border-[1px] rounded-lg gap-7">
                            <h1 className="self-center text-xl font-mont-bd dark:text-white">Additional notes</h1>
                            <textarea/>

                        </div>
                    </div>

                }
            </div>
        </div>
    );
};

export default Checkout;
