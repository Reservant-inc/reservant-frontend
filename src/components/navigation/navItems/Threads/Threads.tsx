import React, { useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import CommentSharpIcon from '@mui/icons-material/CommentSharp';

const Threads: React.FC = () => {
    const [isPressed, setIsPressed] = useState(false);

    const pressHandler = () => {
        setIsPressed(!isPressed);
    };

    return (
        <div>
            <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
                <button
                    id="NotificationsButton"
                    className="relative flex h-[40px] w-[40px] items-center justify-center bg-grey-1 rounded-full"
                    onClick={pressHandler}
                >
                    <CommentSharpIcon className="h-[23px] w-[23px]" />
                </button>
                {isPressed && (
                    <div>

                    </div>
                )}
            </OutsideClickHandler>
        </div>
    )
}

export default Threads;