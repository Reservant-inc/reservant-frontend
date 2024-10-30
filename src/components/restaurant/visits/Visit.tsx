import React, { useContext, useEffect, useState } from "react";
import { RestaurantDetailsType } from "../../../services/types";
import MenuList from "../../restaurantManagement/menus/MenuList";
import { MenuScreenType } from "../../../services/enums";
import Cart from "../Cart";
import { fetchGET } from "../../../services/APIconn";
import { FetchError } from "../../../services/Errors";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../contexts/CartContext";
import SellIcon from '@mui/icons-material/Sell';


interface VisitProps {
    restaurant: RestaurantDetailsType;
}

const getParsedDate = (): string => {
    const today = new Date();
    return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
}

const Visit: React.FC<VisitProps> = ({ restaurant }) => {
    
    const today = getParsedDate()

    const [isOrdering, setIsOrdering] = useState<boolean>(false);
    const [guests, setGuests] = useState<number>(1);
    const [date, setDate] = useState<string>(today);
    const [availableHours, setAvailableHours] = useState<{ from: string, until: string }[]>([]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    const navigate = useNavigate()
    const { items, totalPrice } = useContext(CartContext)
    
    const data = { items: items, totalPrice: totalPrice, date: date, guests: guests, restaurant: restaurant }

    useEffect(() => {
        if (date && guests) {
            fetchAvailableHours();
        }
    }, [date, guests]);

    useEffect(() => {
        if (availableHours.length > 0) {
            generateTimeSlots();
        } else {
            setTimeSlots([])
        }
    }, [availableHours]);

    const fetchAvailableHours = async () => {
        try {
            const visitHours = await fetchGET(`/restaurants/${restaurant.restaurantId}/available-hours?date=${date}&numberOfGuests=${guests}`);
            setAvailableHours(visitHours);
        } catch (error) {
            if (error instanceof FetchError) {
                console.log(error.formatErrors());
            } else {
                console.log('unexpected error', error);
            }
        }
    };

    const generateTimeSlots = () => {
        const slots: string[] = [];
        const now = new Date();
        const isToday = date === getParsedDate();

        availableHours.forEach(({ from, until }) => {
            let currentTime = parseTime(from);
            const endTime = parseTime(until);

            while (currentTime <= endTime) {
                if (!isToday || currentTime >= now) {
                    slots.push(formatTime(currentTime));
                }
                currentTime = new Date(currentTime.getTime() + 30 * 60000);
            }
        });
        setTimeSlots(slots);
    };

    const parseTime = (time: string): Date => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds, 0);
        return date;
    };

    const formatTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    return (
        <>
            {!isOrdering ? (
                <div className="w-full h-[135px] flex flex-col gap-5 pt-3 relative">
                    <div className="flex gap-2">
                        <div className="flex flex-col gap-2 w-[45%]">
                            <div className="w-full flex items-center gap-4 justify-between">
                                <label className="text-md font-mont-md">No. guests:</label>
                                <input
                                    type="number"
                                    value={guests}
                                    min={1}
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                    className="w-32 border-[1px] border-grey-2 rounded-md h-7"
                                />
                            </div>
                            <div className="w-full flex items-center gap-2 justify-between">
                                <label className="text-md font-mont-md">Date:</label>
                                <input
                                    type="date"
                                    value={date}
                                    min={today}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="border-[1px] border-grey-2 rounded-md h-7 w-32"
                                />
                            </div>

                        </div>
                        <div className="flex items-center justify-center w-[60%] p-2">
                            {
                                timeSlots.length > 0 ? (
                                    <div className="w-full h-full flex items-center justify-center gap-3">
                                        <label className="font-mont-md">Available Time Slots</label>
                                        <select className="border-[1px] border-grey-2 rounded-md h-7 w-32 text-sm py-0 px-4 scroll ring-none">
                                            {timeSlots.map((slot, index) => (
                                                <option key={index} value={slot} className="hover:bg-grey-1">
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <h1>No available visit hours.</h1>
                                )
                            }
                        </div>

                    </div>
                    <div className="w-full flex flex-row-reverse gap-2">
                        <button
                            id="RestaurantListAddRestaurantButton"
                            onClick={() => navigate("/checkout", { state: data })}
                            className="flex gap-2 items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
                        >
                            <AccountBalanceIcon className="w-5 h-5"/>
                            <h1 className="font-mont-md text-md">Proceed to checkout</h1>
                        </button>
                        <button
                            id="RestaurantListAddRestaurantButton"
                            onClick={() => setIsOrdering(true)}
                            className="flex gap-2 items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
                        >
                            <ShoppingCartIcon className="w-5 h-5"/>
                            <h1 className="font-mont-md text-md">Order</h1>
                        </button>
                    </div>    
                </div>
            ) : (
                <div className="relative w-full h-[550px] p-3 flex flex-col gap-5 items-center">
                    <div className="w-full h-[calc(100%-3rem)]">
                        <MenuList
                            activeRestaurantId={restaurant.restaurantId}
                            type={MenuScreenType.Order}
                        />
                    </div>
                    <div className="flex flex-row-reverse gap-3 w-full h-8">
                        <button 
                            className="flex gap-2 items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
                            onClick={() => navigate("/checkout", { state:  data  })}
                        >
                            {`CHECKOUT ${totalPrice > 0 ? totalPrice + 'zł' : ''}`}
                            <SellIcon/>
                        </button>
                        <button
                            id="RestaurantListAddRestaurantButton"
                            onClick={() => navigate("/checkout", { state: data })}
                            className="flex gap-2 items-center justify-center px-3 py-1 border-[1px] border-primary dark:border-secondary rounded-md text-primary dark:text-secondary dark:hover:bg-secondary hover:bg-primary hover:text-white dark:hover:text-black"
                        >
                            <AccountBalanceIcon className="w-5 h-5"/>
                            <h1 className="font-mont-md text-md">Skip order</h1>
                        </button>
                        
                    </div>
                    
                    <Cart />
                </div>
            )}
        </>
    );
};

export default Visit;
