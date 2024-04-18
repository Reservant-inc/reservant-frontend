import React, { useState } from "react";
import Language from "../../../assets/images/language.png";
import OutsideClickHandler from "../../reusableComponents/OutsideClickHandler";
import i18next from "i18next";

const LanguageChange: React.FC = () => {

    const [isPressed, setIsPressed] = useState(false)

    const pressHandler = () => {
        setIsPressed(!isPressed)
    }

    const setLanguage = (lang: string) => {
        i18next.changeLanguage(lang)
        localStorage.setItem("i18nextLng", lang)
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
                    <button className={"w-[95%] h-5/12 hover:bg-blue hover:text-cream rounded-sm transition text-left p-1 " +
                        (i18next.language === "en" ? "bg-blue" : "")} onClick={() => setLanguage("en")}>English
                    </button>
                    <button className={"w-[95%] h-5/12 hover:bg-blue hover:text-cream rounded-sm transition text-left p-1 " +
                        (i18next.language === "pl" ? "bg-blue" : "")} onClick={() => setLanguage("pl")}>Polski
                    </button>
                </div>
            }
        </OutsideClickHandler>
    )
}

export default LanguageChange