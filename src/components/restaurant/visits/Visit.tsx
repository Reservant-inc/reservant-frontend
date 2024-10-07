import React, { useState } from "react";
import { RestaurantDetailsType } from "../../../services/types";
import Dialog from "../../reusableComponents/Dialog";
import { Navigate } from "react-router-dom";

interface VisitProps {
    restaurant: RestaurantDetailsType
}

const Visit: React.FC<VisitProps> = ({ restaurant }) => {

    return (
        <div className="h-[90vh] w-[50vw] min-w-[700px] flex justify-center items-center">
            <div>
                {/* reservation logic */}
            </div>
            <button onClick={() => <Navigate to={"/plans"} state={{  }} />}>Confirm</button>
        </div>
    )
}

export default Visit