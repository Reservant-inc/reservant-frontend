import React, { useState } from "react";
import { RestaurantDetailsType } from "../../../services/types";
import { Navigate } from "react-router-dom";
import ConfirmationDialog from "../../reusableComponents/ConfirmationDialog";

interface VisitProps {
    restaurant: RestaurantDetailsType
}

const Visit: React.FC<VisitProps> = ({ restaurant }) => {
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false)

    return (
        <div className="h-[90vh] w-[50vw] min-w-[700px] flex justify-center items-center">
            <div>
                {/* reservation logic */}
            </div>
        </div>
    )
}

export default Visit