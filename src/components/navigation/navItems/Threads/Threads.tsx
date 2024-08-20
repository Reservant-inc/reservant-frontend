import React, { useEffect, useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded';
import { fetchGET } from "../../../../services/APIconn";
import { PaginationType, ThreadType } from "../../../../services/types";
import { Button, CircularProgress } from "@mui/material";

const Threads: React.FC = () => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [threads, setThreads] = useState<ThreadType[]>([]);
    const [isLoadingThreads, setIsLoadingThreads] = useState<Boolean>(false);
    const [isCreatingThread, setIsCreatingThread] = useState<Boolean>(false);

    const pressHandler = () => {
        setIsPressed(!isPressed);
    };

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
                <CommentRoundedIcon className="h-[23px] w-[23px]" />
            </button>
            {isPressed && (
                <div className="flex flex-col items-center nav-dropdown w-[300px] h-[calc(100%-4.5rem)]">
                    <div className="flex justify-between items-center w-full p-2 h-14 shadow-md font-mont-md">
                        <h1 className="text-2xl">Threads</h1>
                        <Button className="flex items-center justify-center text-grey-2 p-1 rounded-full h-10 w-10 min-w-10" onClick={() => setIsCreatingThread(true)}><AddCommentRoundedIcon className="h-5 w-5"/></Button>
                    </div>
                    <div>
                        {!threads.length ? 
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
                                </div>   
                            ) 
                        ) : (
                            <div>

                            </div>    
                        )}
                    </div>
                </div>
            )}
        </OutsideClickHandler>
    )
}

export default Threads;