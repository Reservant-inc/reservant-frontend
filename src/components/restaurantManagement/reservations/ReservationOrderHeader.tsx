import React, { useState } from "react";
import ReservationHistory from "./ReservationHistoory";
import OrderHistory from "./OrderHistory";

interface ReservationOrderHeaderProps {
  activeRestaurantId: number;
}

const ReservationOrderHeader: React.FC<ReservationOrderHeaderProps> = ({ activeRestaurantId }) => {
  const [activeTab, setActiveTab] = useState<string>("reservation");

  return (
    <div className="w-full h-full p-2 flex-col space-y-2 bg-white rounded-lg">
      <div className="flex justify-start p-2">
        <button
          className={`relative h-full rounded-lg justify-center items-center flex gap-2 ${
            activeTab === "reservation"
              ? "text-primary text-lg font-mont-md"
              : "text-grey-2 text-lg font-mont-md"
          }`}
          onClick={() => setActiveTab("reservation")}
        >
          Reservations
          {activeTab === "reservation" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary dark:bg-secondary-2"></span>
          )}
        </button>
        <button
          className={`relative ml-4 h-full rounded-lg justify-center items-center flex gap-2 ${
            activeTab === "order"
              ? "text-primary text-lg font-mont-md"
              : "text-grey-2 text-lg font-mont-md"
          }`}
          onClick={() => setActiveTab("order")}
        >
          Orders
          {activeTab === "order" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary dark:bg-secondary-2"></span>
          )}
        </button>
      </div>
      <div className="mt-4">
        {activeTab === "reservation" ? (
          <ReservationHistory activeRestaurantId={activeRestaurantId} />
        ) : (
          <OrderHistory activeRestaurantId={activeRestaurantId} />
        )}
      </div>
    </div>
  );
};

export default ReservationOrderHeader;
