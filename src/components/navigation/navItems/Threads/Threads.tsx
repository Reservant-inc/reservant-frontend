import React, { useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import CommentSharpIcon from '@mui/icons-material/CommentSharp';
import Tooltip from '@mui/material/Tooltip';

const Threads: React.FC = () => {
    const [isPressed, setIsPressed] = useState(false);

    const pressHandler = () => {
        setIsPressed(!isPressed);
    };

    return (
        <div>
            <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
                <Tooltip title="Open Threads" arrow>
                    <button
                        id="ThreadsButton"
                        className="relative flex h-[40px] w-[40px] items-center justify-center bg-grey-1 rounded-full"
                        onClick={pressHandler}
                    >
                        <CommentSharpIcon className="h-[23px] w-[23px]" />
                    </button>
                </Tooltip>

                {isPressed && (
                    <div>
                        {/* Treść otwartego menu threads */}
                    </div>
                )}
            </OutsideClickHandler>
        </div>
    );
}

export default Threads;
