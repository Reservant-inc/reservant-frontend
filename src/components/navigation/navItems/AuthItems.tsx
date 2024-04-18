import React, { useState } from "react";
import OutsideClickHandler from "../../reusableComponents/OutsideClickHandler";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AuthItems = () => {

    const navigate = useNavigate()

    const [t] = useTranslation("global")

    const [isPressed, setIsPressed] = useState(false)

    const pressHandler = () => {
        setIsPressed(!isPressed)
    }

    return (
        <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
            <button
                className="flex justify-center items-center h-10 w-10 rounded-full hover:bg-l-grey"
                onClick={pressHandler}
            >
                <div className="flex flex-col justify-center items-center gap-[6px] h-5 w-5">
                    <span className="bg-grey w-5 h-[2px] rounded" />
                    <span className="bg-grey w-5 h-[2px] rounded" />
                    <span className="bg-grey w-5 h-[2px] rounded" />
                </div>
            </button>
            {
                isPressed &&
                <div className="absolute w-48 h-28 bg-cream top-[5rem] right-[0.5rem] drop-shadow-xl rounded-2xl flex flex-col items-center justify-around">
                    <button className="w-40 h-10 bg-l-grey hover:bg-blue hover:text-cream transition p-1 rounded-full" onClick={() => navigate("/user/login")}>{t("landing-page.loginButton")}</button>
                    <button className="w-40 h-10 bg-l-grey hover:bg-blue hover:text-cream transition p-1 rounded-full" onClick={() => navigate("/user/register")}>{t("landing-page.registerButton")}</button>
                </div>
            }
        </OutsideClickHandler>
    )
}

export default AuthItems