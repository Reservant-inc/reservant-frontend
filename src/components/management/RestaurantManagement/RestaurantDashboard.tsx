import React from "react";
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement";

const RestaurantDashboard = () => {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="h-1/2 w-full rounded-md bg-white shadow-md">
        <EmployeeManagement />
      </div>
      <div className="h-1/2 w-full rounded-md bg-white shadow-md">
        Graphs and data will be here
      </div>
    </div>
  );
};

export default RestaurantDashboard;
