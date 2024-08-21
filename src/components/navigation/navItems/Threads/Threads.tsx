import React, { useEffect, useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded';
import { fetchGET, fetchPOST } from "../../../../services/APIconn";
import { PaginationType, ThreadType, UserType } from "../../../../services/types"
import { Button, CircularProgress, List, ListItemButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DefaultPhoto from '../../../../assets/images/user.jpg';
import ThreadPreview from "./ThreadPreview";
import SearchIcon from '@mui/icons-material/Search';

const Threads: React.FC = () => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [isLoadingThreads, setIsLoadingThreads] = useState<boolean>(false);
    const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(false);
    const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);
    const [friendSearchQuery, setFriendSearchQuery] = useState<string>('');
    const [friendsToAdd, setFriendsToAdd] = useState<UserType[]>([]);
    const [threadTitle, setThreadTitle] = useState<string>('')
    const [threads, setThreads] = useState<ThreadType[]>([]);
    const [friends, setFriends] = useState<UserType[]>([]);

    const clearStates = () => {
        setFriendSearchQuery('');
        setFriendsToAdd([])
    }

    const pressHandler = () => {
        if (isPressed) {
            setIsCreatingThread(false);
            clearStates()
        }
        setIsPressed(!isPressed);
    };

    const fetchFriends = async (name: string) => {
        try {
            setIsLoadingFriends(true);

            const result: PaginationType = await fetchGET(`/users?name=${name}&filter=friendsOnly`);
            const val: UserType[] = result.items as UserType[]
            const filteredResult = val.filter((newFriend: UserType) => 
                !friendsToAdd.some(friend => friend.userId === newFriend.userId));

            setFriends(filteredResult);
        } finally {
            setIsLoadingFriends(false);
        }
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        if (name.length >= 1) fetchFriends(name);
        else setFriends([]);
    };

    useEffect(() => {
        const getThreads = async () => {
            try {
                setIsLoadingThreads(true);
                const result: PaginationType = await fetchGET('/user/threads');
                if (result.items.length > 0) setThreads(result.items as ThreadType[]);
            } finally {
                setIsLoadingThreads(false);
            }
        };
        getThreads();
    }, []);

    const toggleCreatingThread = () => {
        if (isCreatingThread) {
            clearStates()
        }
        setIsCreatingThread(!isCreatingThread);
    }

    const postThread = async () => {
        try {
            const ids = friendsToAdd.map((friend) => {
                return friend.userId
            })

            const values = {
                title: threadTitle,
                participantIds: ids
            }

            fetchPOST("/threads", JSON.stringify(values))

        } catch (error) {
            console.log(error)
        } finally {
            toggleCreatingThread()
        }
    }

    const handleDeleteFriendToAdd = (id: string) => {
        const filtered = friendsToAdd.filter(friend => friend.userId !== id)
        setFriendsToAdd(filtered)
    }

    const onFriendSelect = async (friendToAdd: UserType) => {
        setFriendsToAdd([...friendsToAdd, friendToAdd]);
    }
    
    const renderThreadsContent = () => {
        if (isLoadingThreads) {
            return (
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-lg text-grey-3 italic">Threads are loading</h1>
                    <CircularProgress className="h-8 w-8 text-grey-2" />
                </div>
            );
        }

        if (!threads.length) {
            return (
                <div className="flex flex-col items-center justify-center gap-3">
                    <h1 className="text-lg text-grey-3 italic text-center">You do not have any active threads yet</h1>
                </div>
            );
        }

        return (
            <List className="w-full h-full">
                {threads.map((thread) => (
                    <ListItemButton className="w-full rounded-md">
                        {/* <ThreadPreview thread={thread}/> */}
                    </ListItemButton>
                ))}
            </List>
        )
    };

    const inputClass = "clean-input py-1 px-0 text-sm italic";

    const renderNewThreadForm = () => (
        <div className="flex flex-col w-full custom-transition border-y-[2px] border-grey-1 py-2 px-3 fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-mont-bd">New thread</h1>
                <button className="flex justify-center items-center h-8 w-8 bg-grey-1 rounded-full" onClick={postThread}><CheckIcon className="h-5 w-5" /></button>
            </div>
            <div className="flex gap-2 items-center pb-1 pt-2">
                <h1 className="text-sm font-mont-md">Title:</h1>
                <input 
                    type="text" 
                    className={inputClass + " w-full"} 
                    value={threadTitle}
                    onChange={(e) => setThreadTitle(e.target.value)}
                />
            </div>
            <div className="flex gap-2 items-center pt-1 pb-2">
                <h1 className="text-sm font-mont-md">Friends:</h1>
                <input
                    type="text"
                    value={friendSearchQuery}
                    onChange={(e) => {
                            setFriendSearchQuery(e.target.value)
                            handleSearchChange(e)
                    }}
                    className={inputClass + " w-[200px]"}
                />
            </div>
            <div className="flex flex-wrap gap-2 pb-2">
                {friendsToAdd.length > 0 && (
                    friendsToAdd.map((friend, index) => (
                        <div key={index} className="flex gap-1 items-center justify-center rounded-full h-6 bg-grey-1 text-sm px-2">
                            {friend.firstName}
                            <button className="flex items-center justify-center rounded-full bg-grey-2 h-4 w-4" onClick={() => handleDeleteFriendToAdd(friend.userId)}><CloseIcon className="h-3 w-3 text-white" /></button>
                        </div>
                    ))
                )}
            </div>
            {friendSearchQuery.length > 0 && (
                <div className={`h-[${
                        friends.length <= 4 ? friends.length*50 : 200
                    }] ${
                        friends.length > 4 && 'overflow-y-scroll scroll'
                    }`}>
                    {friends.length > 0 ? (
                        <List className="w-full font-mont-md dark:bg-black p-0" component="nav">
                        {friends.map((friend, index) => (
                            !friendsToAdd.includes(friend) && 
                            <ListItemButton
                                key={index}
                                className="rounded-lg px-2 py-1 hover:bg-grey-0 py-2"
                                onClick={() => onFriendSelect(friend)}
                            >
                                <div className="flex gap-[5px] items-center text-sm w-full overflow-x-hidden">
                                    <img src={DefaultPhoto} alt="user photo" className="h-8 w-8 rounded-full" />
                                    <h1>{friend.firstName}</h1>
                                    <h1>{friend.lastName}</h1>
                                </div>
                            </ListItemButton>
                        ))}
                    </List>
                    ) : (
                        isLoadingFriends ? (
                            <div className="flex flex-col items-center gap-2">
                                <CircularProgress className="h-8 w-8 text-grey-2" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3">
                                <h1 className="text-sm text-grey-3 italic text-center">No results</h1>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );

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
                        <Button
                            className={`flex items-center justify-center bg-grey-1 text-black p-1 rounded-full h-10 w-10 min-w-10 ${isCreatingThread ? 'text-primary' : 'text-black'}`}
                            onClick={toggleCreatingThread}
                        >
                            <AddCommentRoundedIcon className="h-5 w-5" />
                        </Button>
                    </div>
                    {isCreatingThread && renderNewThreadForm()}
                    <div className="px-3 py-2 w-full">
                        <div className="w-full flex px-2 rounded-full h-10 items-center bg-grey-0 border-[1px] border-grey-1 font-mont-md">
                            <input
                            type="text"
                            placeholder="Szukaj wątków"
                            className="w-[250px] p-2 clean-input h-8"
                            />
                            <SearchIcon className="hover:cursor-pointer h-[25px] w-[25px]"/>
                        </div>
                    </div>
                    <div className="h-full w-full flex items-center justify-center px-2">
                        {renderThreadsContent()}
                    </div>
                </div>
            )}
        </OutsideClickHandler>
    );
};

export default Threads;
