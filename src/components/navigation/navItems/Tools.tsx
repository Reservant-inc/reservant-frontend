import React, { useState } from "react";
import OutsideClickHandler from "../../reusableComponents/OutsideClickHandler";
import User from "../../../assets/images/user.jpg"

const Tools: React.FC = () => {

    const [isPressed, setIsPressed] = useState(false)

    const pressHandler = () => {
        setIsPressed(!isPressed)
    }

    return (
        <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
            <button
                className="h-10 w-10 flex justify-center items-center"
                onClick={pressHandler}
            >
                <img src={User} alt="logo" className="h-10 rounded-full" />
            </button>
            {
                isPressed &&
                <div className="absolute w-36 h-60  bg-white text-black dark:bg-black dark:text-white top-[4rem] right-[0.5rem] drop-shadow-xl rounded flex flex-col items-center justify-around">
                    
                </div>
            }
        </OutsideClickHandler>
    )
}

export default Tools