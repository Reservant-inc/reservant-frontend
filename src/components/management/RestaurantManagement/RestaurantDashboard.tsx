import React from "react"
import EmployeeManagement from "../EmployeeManagement/EmployeeManagement"

const RestaurantDashboard = () => {
    return(
        <div className="h-full w-full flex gap-2">
            <div className="bg-white h-full w-1/2 rounded-md shadow-md">
                <EmployeeManagement/>
            </div>
            <div className="bg-white h-full w-1/2 rounded-md shadow-md">
                Graphs and data will be here
            </div>
        </div>
    )
}

export default RestaurantDashboard