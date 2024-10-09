import React, { useEffect, useState } from "react";
import { RestaurantDetailsType } from "../../../services/types";
import MenuList from "../../restaurantManagement/menus/newMenus/MenuList";
import { MenuScreenType } from "../../../services/enums";
import Cart from "../Cart";
import { fetchGET } from "../../../services/APIconn";

interface VisitProps {
    restaurant: RestaurantDetailsType;
}

const Visit: React.FC<VisitProps> = ({ restaurant }) => {
    const [isOrdering, setIsOrdering] = useState<boolean>(false);
    const [visitDate, setVisitDate] = useState<string>("");
    const [guestCount, setGuestCount] = useState<number>(1);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>("");

    useEffect(() => {
        if (visitDate) {
            fetchAvailableVisits();
        }
    }, [visitDate]);

    const fetchAvailableVisits = async () => {
        try {
            const response = await fetchGET(`/restaurants/${restaurant.restaurantId}/visits?dateStart=${visitDate}T00:00:00&dateEnd=${visitDate}T23:59:59`)
            const visits = response.items;
            calculateAvailableTimeSlots(visits);
        } catch (error) {
            console.error("Error fetching visits", error);
        }
    };

    const calculateAvailableTimeSlots = (visits: any[]) => {
        const reservedSlots: string[] = visits.map((visit) => visit.date);
        const times: string[] = [];

        for (let hour = 13; hour <= 21; hour++) {
            for (let minutes of [0, 30]) {
                const time = `${hour}:${minutes === 0 ? "00" : minutes}`;
                const endTime = `${hour + 2}:${minutes === 0 ? "00" : minutes}`;
                if (!reservedSlots.includes(time) && !reservedSlots.includes(endTime)) {
                    times.push(time);
                }
            }
        }
        setAvailableTimes(times);
    };

    const findSmallestTable = () => {
        const suitableTables = restaurant.tables
            .filter((table) => table.capacity >= guestCount)
            .sort((a, b) => a.capacity - b.capacity);
        return suitableTables[0];
    };

    const handleReserve = () => {
        const table = findSmallestTable();
        if (!table) {
            alert("No available table for the selected guest count.");
            return;
        }
        

        // do zrobienia
    };

    return (
        <div className="h-[90vh] w-[50vw] min-w-[700px] flex justify-center items-center">
            {
                !isOrdering ? (
                    <div className="w-full h-full">
                        <div className="mb-4">
                            <label htmlFor="date">Select Date:</label>
                            <input
                                type="date"
                                id="date"
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                className="border px-2 py-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="guests">Number of Guests:</label>
                            <input
                                type="number"
                                id="guests"
                                value={guestCount}
                                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                className="border px-2 py-1"
                                min="1"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Select Time:</label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="border px-2 py-1"
                            >
                                <option value="">Select Time</option>
                                {availableTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleReserve}
                            className="px-4 py-2 bg-blue-500 rounded-lg"
                        >
                            Reserve
                        </button>
                        <button
                            onClick={() => setIsOrdering(true)}
                            className="px-4 py-2 bg-green-500 rounded-lg mt-4"
                        >
                            Proceed to Order
                        </button>
                    </div>
                ) : (
                    <div className="relative w-full h-full px-3 py-3 flex flex-col gap-5 items-center">
                        <h1 className="text-2xl font-mont-bd dark:text-white">Order food for your reservation</h1>
                        <MenuList activeRestaurantId={restaurant.restaurantId} type={MenuScreenType.Order} />
                        <div className="flex flex-row-reverse w-full">
                            <button className="px-3 py-1 text-lg rounded-lg font-mont-md text-primary hover:text-white hover:bg-primary dark:hover:bg-secondary dark:hover:text-black dark:text-secondary border-[1px] border-primary dark:border-secondary">
                                Skip order
                            </button>
                        </div>
                        <Cart />
                    </div>
                )
            }
        </div>
    );
};

export default Visit;
