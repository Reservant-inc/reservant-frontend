import React, { useEffect, useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded';
import { fetchGET } from "../../../../services/APIconn";
import { PaginationType, ThreadType, UserSearchType, UserType } from "../../../../services/types"
import { Button, Chip, CircularProgress, List, ListItem } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const Threads: React.FC = () => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [threads, setThreads] = useState<ThreadType[]>([]);
    const [isLoadingThreads, setIsLoadingThreads] = useState<boolean>(false);
    const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);
    const [friendSearchQuery, setFriendSearchQuery] = useState<string>('')
    const [friendsToAdd, setFriendsToAdd] = useState<string[]>([])
    const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [friends, setFriends] = useState<UserType[]>([])

    const pressHandler = () => {
        if (isPressed)
            setIsCreatingThread(false)
        setIsPressed(!isPressed);
    };

    const fetchFriends = async (name: string) => {
        try {
            setIsLoadingFriends(true)

            const result: PaginationType = await fetchGET(`/users?name=${name}`)

            setFriends(result.items as UserSearchType[])

        } catch (error) {
            console.log("error fetching users", error)
        } finally {
            setIsLoadingFriends(false)
        }
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setSearchTerm(name)

        if (name.length >= 1) 
            fetchFriends(name)
        else
            setFriends([])
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
            <Button
                id="NotificationsButton"
                className={`relative flex h-[40px] w-[40px] min-w-[40px] items-center justify-center bg-grey-1 rounded-full text-black ${isPressed && 'text-primary'}`}
                onClick={pressHandler}
            >
                <CommentRoundedIcon className="h-[23px] w-[23px]" />
            </Button>
            {isPressed && (
                <div className="flex flex-col items-center nav-dropdown w-[300px] h-[calc(100%-4.5rem)]">
                    <div className="flex justify-between items-center w-full py-2 px-3 h-14 custom-transition">
                        <h1 className="text-xl font-mont-bd">Threads</h1>
                        <Button className={`flex items-center justify-center bg-grey-1 text-black p-1 rounded-full h-10 w-10 min-w-10 ${isCreatingThread ? 'text-primary' : 'text-black'}`} onClick={() => setIsCreatingThread(!isCreatingThread)}><AddCommentRoundedIcon className="h-5 w-5"/></Button>
                    </div>
                    {isCreatingThread ? (
                        <div className="relative flex flex-col gap-2 w-full custom-transition border-y-[2px] border-grey-1 py-2 px-3 fade-in">
                            <div className="flex justify-between items-center">
                                <h1 className="text-lg font-mont-bd">New thread</h1>
                                <button className="flex justify-center items-center h-8 w-8 bg-grey-1 rounded-full"><CheckIcon className="h-5 w-5"/></button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <h1 className="text-sm font-mont-md">Title:</h1>
                                <input
                                    type="text"
                                    className="clean-input py-1 px-0 text-sm w-full italic"
                                />
                            </div>
                            <div className="relative flex gap-2 items-center">
                                <h1 className="text-sm font-mont-md">Friends:</h1>
                                <input
                                    type="text"
                                    value={friendSearchQuery} 
                                    onChange={(e) => setFriendSearchQuery(e.target.value)}
                                    className="clean-input py-1 px-0 text-sm w-[200px] italic"
                                    />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {friendsToAdd.length > 0 && (
                                        (friendsToAdd.map((friend, index) => (
                                            <div key={index} className="flex gap-1 items-center justify-center rounded-full h-6 bg-grey-1 text-sm px-2">
                                                {friend}
                                                <button className="flex items-center justify-center rounded-full bg-grey-2 h-4 w-4"><CloseIcon className="h-3 w-3 text-white"/></button>
                                            </div>
                                        )))
                                )}
                            </div>
                            {friendSearchQuery.length > 0 ? (
                                <div className="h-[300px] custom-transition">
                                </div>
                            ) : (
                                <div className="h-0 custom-transition"/>
                            )}
                        </div>    
                    ) : ( 
                        <div className="h-0 w-full custom-transition py-2 px-3"/>  
                    )}
                    <div className="h-full flex items-center justify-center">
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