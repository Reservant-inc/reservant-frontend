import React from "react";
import { ManagementSectionProps } from "../../../services/interfaces";

const Section: React.FC<ManagementSectionProps> = ({ currentPage, desiredPage, setActivePage, component }) => {

    const isClicked = currentPage === desiredPage

    return(
        <>
        {/* ten przycisk tez nie wiem do czego */}
        <button id="ManagementSectionButton" className={"relative h-14 w-full flex justify-center items-center fill-grey-2" + (isClicked ? ' fill-primary-2 dark:fill-secondary dark:hover:bg-none hover:bg-transpartent' : " dark:hover:bg-grey-4 hover:bg-grey-1")} onClick={() => setActivePage(desiredPage)}>
            {component}
        </button>
        </>
    )
}

export default Section