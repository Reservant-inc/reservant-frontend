import React, { useState } from "react";
import Language from "../../../../assets/images/language.png";
import OutsideClickHandler from "../../../eventHandlers/OutsideClickHandler";

const LanguageChange = () => {

    const [isPressed, setIsPressed] = useState(false)

    const pressHandler = () => {
        setIsPressed(!isPressed)
    }

    const setLanguage = () => {
        //TODO - change language
        setIsPressed(!isPressed)
    }

    return (
            <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
                <button 
                    className={"flex justify-center items-center h-10 w-10 rounded-full hover:bg-l-grey" + (isPressed ? " bg-l-grey" : "")}
                    onClick={pressHandler}
                >
                    <img src={Language} alt="logo" className="h-6" />
                </button>
                {
                isPressed && 
                    <div className="absolute w-32 h-20 bg-cream top-[5rem] right-[0.5rem] drop-shadow-xl rounded flex flex-col items-center justify-around">
                        <button className="w-[95%] h-5/12 hover:bg-blue hover:text-cream rounded-sm transition text-left p-1" onClick={setLanguage}>English</button>
                        <button className="w-[95%] h-5/12 hover:bg-blue hover:text-cream rounded-sm transition text-left p-1" onClick={setLanguage}>Polish</button>
                    </div>
                }
            </OutsideClickHandler>
    )
}

export default LanguageChange