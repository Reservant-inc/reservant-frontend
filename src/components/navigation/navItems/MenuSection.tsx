import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SectionProps } from "../../../services/interfaces";

const Section: React.FC<SectionProps> = ({ component, connString }) => {

    const navigate = useNavigate()
    const location = useLocation()

    const isClicked = location.pathname === connString

    return(
        <div className="relative h-14">
            {/* do czego? */}
            <button id="MenuSectionButton" className={'h-12 mt-1 w-28 rounded-xl fill-grey-2 flex flex-col justify-between items-center relative' + (isClicked ? ' fill-primary-2 dark:fill-secondary dark:hover:bg-none hover:bg-transpartent' : " dark:hover:bg-grey-4 hover:bg-grey-1")} onClick={() => navigate(connString)}>
                { component }
            </button>
            { isClicked && <span className="h-[3px] w-full bg-primary-2 dark:bg-secondary absolute bottom-0 transition transform scale-y-100"/> }
        </div>
    )
}

export default Section