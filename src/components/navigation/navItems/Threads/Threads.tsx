import React, { useEffect, useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import CommentSharpIcon from '@mui/icons-material/CommentSharp';
import { fetchGET } from "../../../../services/APIconn";
import { PaginationType, ThreadType } from "../../../../services/types";
import { Button, CircularProgress } from "@mui/material";

const Threads: React.FC = () => {
    const [isPressed, setIsPressed] = useState(false);
    const [threads, setThreads] = useState<ThreadType[]>();
    const [isLoadingThreads, setIsLoadingThreads] = useState<Boolean>(false);

    const pressHandler = () => {
        setIsPressed(!isPressed);
    };

    const handleNewThread = () => {
        pressHandler()

    }

    useEffect(() => {
        const getThreads = async () => {
            try {
                setIsLoadingThreads(true)
                const result: PaginationType = await fetchGET('/user/threads')
                
                if (result.items.length > 0)
                    setThreads(result.items as ThreadType[])

            } catch (error) {
                console.log("Error fetching threads:", error);
            } finally {
                setIsLoadingThreads(false)
            }
        }
        getThreads()
    }, [])

    return (
        <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
            <button
                id="NotificationsButton"
                className="relative flex h-[40px] w-[40px] items-center justify-center bg-grey-1 rounded-full"
                onClick={pressHandler}
            >
                <CommentSharpIcon className="h-[23px] w-[23px]" />
            </button>
            {isPressed && (
                <div className="flex items-center justify-center nav-dropdown w-[300px] h-[calc(100%-4.5rem)]">
                    {!threads ? 
                    (
                        isLoadingThreads ? 
                        (
                            <div className="flex flex-col items-center gap-2">
                                <h1 className="text-lg text-grey-3 italic">Threads are loading</h1>
                                <CircularProgress className="h-8 w-8 text-grey-2"/>
                            </div>   
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3">
                                <h1 className="text-lg text-grey-3 italic text-center">You do not have any active threads yet</h1>
                                <Button className="bg-primary text-white px-3 py-2" onClick={() => handleNewThread()}>Create a Thread</Button>
                            </div>   
                        ) 
                    ) : (
                        <div>

                        </div>    
                    )}
                </div>
            )}
        </OutsideClickHandler>
    )
}

export default Threads;