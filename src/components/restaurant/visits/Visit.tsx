import React, { useContext, useEffect, useState } from "react";
import { RestaurantDetailsType } from "../../../services/types";
import MenuList from "../../restaurantManagement/menus/MenuList";
import { MenuScreenType } from "../../../services/enums";
import Cart from "../Cart";
import { fetchGET } from "../../../services/APIconn";
import { FetchError } from "../../../services/Errors";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../contexts/CartContext";
import SellIcon from "@mui/icons-material/Sell";

interface VisitProps {
  restaurant: RestaurantDetailsType;
}

const getParsedDate = (): string => {
  const today = new Date();
  return (
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0")
  );
};

const Visit: React.FC<VisitProps> = ({ restaurant }) => {
  const today = getParsedDate();

  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [guests, setGuests] = useState<number>(1);
  const [date, setDate] = useState<string>(today);
  const [availableHours, setAvailableHours] = useState<
    { from: string; until: string }[]
  >([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const navigate = useNavigate();
  const { items, totalPrice } = useContext(CartContext);

  const data = {
    items: items,
    totalPrice: totalPrice,
    date: date,
    guests: guests,
    restaurant: restaurant,
  };

  useEffect(() => {
    if (date && guests) {
      fetchAvailableHours();
    }
  }, [date, guests]);

  useEffect(() => {
    if (availableHours.length > 0) {
      generateTimeSlots();
    } else {
      setTimeSlots([]);
    }
  }, [availableHours]);

  const fetchAvailableHours = async () => {
    try {
      const visitHours = await fetchGET(
        `/restaurants/${restaurant.restaurantId}/available-hours?date=${date}&numberOfGuests=${guests}`,
      );

      setAvailableHours(visitHours);
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors());
      } else {
        console.log("unexpected error", error);
      }
    }
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    const now = new Date();
    const isToday = date === getParsedDate();

    console.log(availableHours);

    availableHours.forEach(({ from, until }) => {
      console.log(from);

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

  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <>
      {!isOrdering ? (
        <div className="relative flex h-[135px] w-full flex-col gap-5 pt-3">
          <div className="flex gap-2">
            <div className="flex w-[45%] flex-col gap-2">
              <div className="flex w-full items-center justify-between gap-4">
                <label className="text-md font-mont-md">No. guests:</label>
                <input
                  type="number"
                  value={guests}
                  min={1}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="h-7 w-32 rounded-md border-[1px] border-grey-2"
                />
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <label className="text-md font-mont-md">Date:</label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-7 w-32 rounded-md border-[1px] border-grey-2"
                />
              </div>
            </div>
            <div className="flex w-[60%] items-center justify-center p-2">
              {timeSlots.length > 0 ? (
                <div className="flex h-full w-full items-center justify-center gap-3">
                  <label className="font-mont-md">Available Time Slots</label>
                  <select className="scroll ring-none h-7 w-32 rounded-md border-[1px] border-grey-2 px-4 py-0 text-sm">
                    {timeSlots.map((slot, index) => (
                      <option
                        key={index}
                        value={slot}
                        className="hover:bg-grey-1"
                      >
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <h1>No available visit hours.</h1>
              )}
            </div>
          </div>
          <div className="flex w-full flex-row-reverse gap-2">
            <button
              id="RestaurantListAddRestaurantButton"
              onClick={() => navigate("/checkout", { state: data })}
              className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            >
              <AccountBalanceIcon className="h-5 w-5" />
              <h1 className="text-md font-mont-md">Proceed to checkout</h1>
            </button>
            <button
              id="RestaurantListAddRestaurantButton"
              onClick={() => setIsOrdering(true)}
              className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <h1 className="text-md font-mont-md">Order</h1>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative flex h-[550px] w-full flex-col items-center gap-5 p-3">
          <div className="h-[calc(100%-3rem)] w-full">
            <MenuList
              activeRestaurantId={restaurant.restaurantId}
              type={MenuScreenType.Order}
            />
          </div>
          <div className="flex h-8 w-full flex-row-reverse gap-3">
            <button
              className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
              onClick={() => navigate("/checkout", { state: data })}
            >
              {`CHECKOUT ${totalPrice > 0 ? totalPrice + "zł" : ""}`}
              <SellIcon />
            </button>
            <button
              id="RestaurantListAddRestaurantButton"
              onClick={() => navigate("/checkout", { state: data })}
              className="flex items-center justify-center gap-2 rounded-md border-[1px] border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black"
            >
              <AccountBalanceIcon className="h-5 w-5" />
              <h1 className="text-md font-mont-md">Skip order</h1>
            </button>
          </div>

          <Cart />
        </div>
      )}
    </>
  );
};

export default Visit;
