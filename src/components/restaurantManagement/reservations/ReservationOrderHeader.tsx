import React, { useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import ReservationHistory from "./ReservationHistoory";
import OrderHistory from "./OrderHistory";
import { ManagementProps } from "../../../services/interfaces/restaurant"


const ReservationOrderHeader: React.FC<ManagementProps> = ({ activeRestaurantId }) => {
  const [activeTab, setActiveTab] = useState<string>("reservation");

  return (
    <div>
      <div className="flex justify-start p-2">
        <ButtonGroup>
          <Button
            variant="text"
            className={`relative ${activeTab === "reservation" ? "text-primary dark:text-secondary-2" : "text-grey-2"} text-lg`}
            onClick={() => setActiveTab("reservation")}
          >
            Reservations
            {activeTab === "reservation" && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary dark:bg-secondary-2"></span>
            )}
          </Button>
          <Button
            variant="text"
            className={`relative ${activeTab === "order" ? "text-primary dark:text-secondary-2" : "text-grey-2"} text-lg`}
            onClick={() => setActiveTab("order")}
          >
            Orders
            {activeTab === "order" && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary dark:bg-secondary-2"></span>
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
