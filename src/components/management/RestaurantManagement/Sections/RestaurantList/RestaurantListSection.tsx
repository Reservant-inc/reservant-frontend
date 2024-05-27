import React, { useState } from "react";
import MyGroups from "./MyGroups";
import { Box, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestaurantRegister from "../../../../register/restaurantRegister/RestaurantRegister";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

const RestaurantListSection: React.FC = () => {
    const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>("")

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
            <div className="h-[10%] w-full z-1 shadow-md flex justify-between items-center px-3">
                <button
                    id="RestaurantListAddRestaurantButton"
                    onClick={() => setIsModalOpen(true)}
                    className="h-[60%] w-40 rounded-lg text-primary font-bold justify-center items-center flex  gap-2 hover:bg-grey-1"
                >
                    <AddIcon />
                    Add restaurant
                </button>
                <div className="flex gap-2 items-center">
                    <SearchSharpIcon className="text-primary"/>
                    <input className="rounded-full border-1 border-grey-1 ring-0 focus:bg-grey-0 w-40 h-10" type="text" value={filter} onChange={(e)=>{setFilter(e.target.value)}} /> 
                </div>
            </div>
            <div className="h-[90%] w-full">
                <MyGroups filter={filter} activeRestaurantId={activeRestaurantId} handleChangeActiveRestaurant={handleChangeActiveRestaurant}/>
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