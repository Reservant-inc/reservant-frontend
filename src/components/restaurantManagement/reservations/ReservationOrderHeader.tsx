import React, { useState } from "react";
import ReservationHistory from "./ReservationHistoory";
import OrderHistory from "./OrderHistory";
import { ButtonGroup, Button } from "@mui/material";

interface ReservationOrderHeaderProps {
  activeRestaurantId: number;
}

const ReservationOrderHeader: React.FC<ReservationOrderHeaderProps> = ({
  activeRestaurantId,
}) => {
  const [activeTab, setActiveTab] = useState<string>("reservation");

  return (
    <div className="w-full h-full p-2 flex-col space-y-2 bg-white rounded-b-lg">
      <div className="flex justify-start p-2">
        <ButtonGroup>
          <Button
            variant="text"
            className={`relative ${activeTab === "reservation" ? "text-primary dark:text-secondary-2" : "text-grey-2"} text-lg`}
            onClick={() => setActiveTab("reservation")}
          >
            Reservations
            {activeTab === "reservation" && (
              <span className="absolute bottom-0 left-0 h-1 w-full bg-primary dark:bg-secondary-2"></span>
            )}
          </Button>
          <Button
            variant="text"
            className={`relative ${activeTab === "order" ? "text-primary dark:text-secondary-2" : "text-grey-2"} text-lg`}
            onClick={() => setActiveTab("order")}
          >
            Orders
            {activeTab === "order" && (
              <span className="absolute bottom-0 left-0 h-1 w-full bg-primary dark:bg-secondary-2"></span>
            )}
          </Button>
        </ButtonGroup>
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
