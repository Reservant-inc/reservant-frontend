import React, { useState } from "react";
import MyGroups from "./MyGroups";
import { Box, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestaurantRegister from "../../../register/restaurantRegister/RestaurantRegister";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

interface RestaurantListSectionProps {
    handleChangeActiveRestaurant: (restaurantGroupId: number) => void
    setActiveSectionName: (sectionName: string) => void
}

const RestaurantListSection: React.FC<RestaurantListSectionProps> = ({ handleChangeActiveRestaurant, setActiveSectionName }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>("")

      const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: '#fefefe',
        borderRadius: '0.5rem',
        boxShadow: 24,
        p: 4,
      };

    return(
        <div className="h-full w-full bg-white rounded-lg">
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
                <MyGroups filter={filter} handleChangeActiveRestaurant={handleChangeActiveRestaurant} setActiveSectionName={setActiveSectionName}/>
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