import React, { useState } from "react";
import MyGroups from "./MyGroups";
import { Box, Modal, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestaurantRegister from "../../../../register/restaurantRegister/RestaurantRegister";

const RestaurantListSection: React.FC = () => {
    const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [val, setVal] = useState<string>("")

      const handleChangeActiveRestaurant = (restaurantId: number) => {
        setActiveRestaurantId(restaurantId);
      };

      const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        borderRadius: '0.5rem',
        boxShadow: 24,
        p: 4,
      };

    return(
        <div className="h-full w-full">
            <div className="h-[10%] w-full z-1 shadow-md flex items-center px-3">
                <button
                    id="RestaurantListAddRestaurantButton"
                    onClick={() => setIsModalOpen(true)}
                    className="h-[60%] w-[11%] rounded-lg text-primary-2 font-bold justify-center items-center flex gap-2 hover:bg-grey-1"
                >
                    <AddIcon />
                    Add restaurant
                </button>
                <div>
                    <input type="text" value={val} onChange={(e) => setVal(e.target.value)}/>
                </div>
            </div>
            <div className="h-[90%] w-full">
                <MyGroups val={val} activeRestaurantId={activeRestaurantId} handleChangeActiveRestaurant={handleChangeActiveRestaurant}/>
            </div>
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <Box sx={style}>
                    <RestaurantRegister />
                </Box>
            </Modal>
        </div>
    )
}

export default RestaurantListSection