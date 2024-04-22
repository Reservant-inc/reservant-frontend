import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SectionProps } from "../../../services/interfaces";

const Section: React.FC<SectionProps> = ({ component, connString }) => {

    const navigate = useNavigate()
    const location = useLocation()

    const isClicked = location.pathname === connString

    return(
        <div>
            <button className={'h-14 w-24 fill-icon hover:bg-[#2b2b2b] flex flex-col justify-center items-center' + (isClicked ? ' fill-primary dark:fill-secondary' : "")} onClick={() => navigate(connString)}>
                { component }
            </button>
            { isClicked && <span className="h-[2px] w-full bg-primary dark:color-secondary flex-end"/> }
        </div>
    )
}

export default Section