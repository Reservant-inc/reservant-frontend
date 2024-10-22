import React, { useEffect, useState } from "react";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import { fetchGET, fetchPOST, getImage } from "../../../../services/APIconn";
import {
  PaginationType,
  ThreadType,
  UserType,
} from "../../../../services/types";
import { Button, CircularProgress, List, ListItemButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DefaultPhoto from "../../../../assets/images/user.jpg";
import ThreadPreview from "./ThreadPreview";
import SearchIcon from "@mui/icons-material/Search";
import Thread from "./Thread";
import { FetchError } from "../../../../services/Errors";
import InfiniteScroll from "react-infinite-scroll-component";
import InactiveThread from "./InactiveThread";
import { useTranslation } from "react-i18next";

const Threads: React.FC = () => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isLoadingThreads, setIsLoadingThreads] = useState<boolean>(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(false);
  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState<string>("");
  const [friendsToAdd, setFriendsToAdd] = useState<UserType[]>([]);
  const [threadTitle, setThreadTitle] = useState<string>("");
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [friends, setFriends] = useState<UserType[]>([]);
  const [activeThreads, setActiveThreads] = useState<ThreadType[]>([])
  const [inactiveThreads, setInactiveThreads] = useState<ThreadType[]>([])
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [t] = useTranslation("global");

  const clearStates = () => {
    setFriendSearchQuery("");
    setThreadTitle("");
    setFriendsToAdd([]);
  };

  const pressHandler = () => {
    if (isPressed) {
      setIsCreatingThread(false);
      clearStates();
    } else {
      setHasMore(true)
      setPage(0)
    }

    setIsPressed(!isPressed);
  };

  const fetchFriends = async (name: string) => {
    try {
      setIsLoadingFriends(true);

      const result: PaginationType = await fetchGET(
        `/users?name=${name}&filter=friendsOnly`,
      );
      const val: UserType[] = result.items as UserType[];
      const filteredResult = val.filter(
        (newFriend: UserType) =>
          !friendsToAdd.some((friend) => friend.userId === newFriend.userId),
      );

      setFriends(filteredResult);
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("Unexpected error:", error);
      }
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    if (name.length >= 1) fetchFriends(name);
    else setFriends([]);
  };

  const getThreads = async () => {
    try {

      if (page === 0) setIsLoadingThreads(true);

      const result: PaginationType = await fetchGET(`/user/threads?page=${page}`);
      const newThreads = result.items as ThreadType[]

      if (newThreads.length < 10) setHasMore(false);

      if (page > 0)
        setThreads((prevThreads) => [...prevThreads, ...newThreads]);
      else
        setThreads(newThreads);

    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("Unexpected error:", error);
      }
    } finally {
      setIsLoadingThreads(false);
    }
  };

  useEffect(() => {
    getThreads()
  }, [page]);

  useEffect(() => {
    getThreads();
  }, []);

  const toggleCreatingThread = () => {
    if (isCreatingThread) {
      clearStates();
    }
    setIsCreatingThread(!isCreatingThread);
  };

  const postThread = async () => {
    try {
      const ids = friendsToAdd.map((friend) => {
        return friend.userId;
      });

      const values = {
        title: threadTitle,
        participantIds: ids,
      };

      fetchPOST("/threads", JSON.stringify(values));
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("Unexpected error:", error);
      }
    } finally {
      toggleCreatingThread();
      getThreads()
    }
  };

  const handleDeleteFriendToAdd = (id: string) => {
    const filtered = friendsToAdd.filter((friend) => friend.userId !== id);
    setFriendsToAdd(filtered);
  };

  const onFriendSelect = async (friendToAdd: UserType) => {
    setFriendsToAdd([...friendsToAdd, friendToAdd]);
  };

  const handleThreadOpen = (thread: ThreadType) => {
    setIsPressed(false);

    const isActive = activeThreads.some(
      (activeThread) => activeThread.threadId === thread.threadId
    );

    if (isActive) return;

    const isInactive = inactiveThreads.some(
      (inactiveThread) => inactiveThread.threadId === thread.threadId
    );

    if (isInactive) {
      handleThreadMaximize(thread);
    } else {
      if (activeThreads.length >= 2) {
        handleThreadMinimize(activeThreads[0]);
      }
      setActiveThreads((prevThreads) => [...prevThreads, thread]);
    }
  };

  const handleThreadClose = (thread: ThreadType) => {

    const isActive = activeThreads.some(
      (activeThread) => activeThread.threadId === thread.threadId
    );

    if (isActive)
      setActiveThreads((prevThreads) =>
        prevThreads.filter((activeThread) => activeThread.threadId !== thread.threadId)
      );
    else
      setInactiveThreads((prevThreads) =>
        prevThreads.filter((inactiveThread) => inactiveThread.threadId !== thread.threadId)
      );
  };

  const handleThreadMinimize = (thread: ThreadType) => {
    setActiveThreads((prevThreads) =>
      prevThreads.filter((activeThread) => activeThread.threadId !== thread.threadId)
    );

    if (inactiveThreads.length >= 5) {
      handleThreadClose(inactiveThreads[0]);
    }

    setInactiveThreads((prevThreads) => [...prevThreads, thread]);
  };

  const handleThreadMaximize = (thread: ThreadType) => {

    setInactiveThreads((prevThreads) =>
      prevThreads.filter((inactiveThread) => inactiveThread.threadId !== thread.threadId)
    );

    if (activeThreads.length >= 2) {
      const earliestActiveThread = activeThreads[0];

      setActiveThreads((prevThreads) =>
        prevThreads.filter((_, index) => index !== 0)
      );

      setInactiveThreads((prevThreads) => {
        const updatedInactiveThreads = [...prevThreads, earliestActiveThread];

        if (updatedInactiveThreads.length > 5) {
          return updatedInactiveThreads.slice(1);
        }

        return updatedInactiveThreads;
      });
    }

    setActiveThreads((prevThreads) => [...prevThreads, thread]);
  };


  const renderUserPhotos = (thread: ThreadType) => {
    return (
      thread.participants.length > 1 ? (
        <div className="relative w-10 h-10">
          <div className="absolute h-8 w-8 flex items-center justify-center bg-white dark:bg-black z-[0] top-0 right-0 rounded-full">
            <img src={getImage(thread.participants[0].photo, DefaultPhoto)} className="absolute h-7 w-7 rounded-full" />
          </div>
          <div className="absolute h-8 w-8 flex items-center justify-center bg-white dark:bg-black z-[1] bottom-0 left-0 rounded-full">
            <img src={getImage(thread.participants[1].photo, DefaultPhoto)} className="absolute h-7 w-7 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center">
          <div className="h-10 w-10 flex items-center justify-center bg-white dark:bg-black rounded-full">
            <img src={getImage(thread.participants[0].photo, DefaultPhoto)} className="h-9 w-9 rounded-full" />
          </div>
        </div>
      )
    )
  }

  const renderThreadsContent = () => {
    if (isLoadingThreads) {
      return (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-lg italic text-grey-6 dark:text-grey-2">{t("threads.loading")}</h1>
          <CircularProgress className="h-8 w-8 text-grey-2" />
        </div>
      );
    }

    if (!threads.length) {
      return (
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="text-center text-lg italic text-grey-6 dark:text-grey-2">
            {t("threads.no-threads")}
          </h1>
        </div>
      );
    }

    return (
      <List className="h-full w-full p-0">
        <InfiniteScroll
          dataLength={threads.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={hasMore}
          loader={<CircularProgress />}
          scrollableTarget="scrollableDiv"
          className="hidescroll"
        >
          {threads.map((thread) => (
            <ListItemButton key={thread.threadId} className="w-full rounded-md p-2 dark:hover:bg-grey-5" onClick={() => handleThreadOpen(thread)}>
              {<ThreadPreview thread={thread} renderUserPhotos={renderUserPhotos} />}
            </ListItemButton>
          ))}
        </InfiniteScroll>
      </List>
    );
  };

  const inputClass = "clean-input py-1 px-0 text-sm italic dark:text-white";

  const renderNewThreadForm = () => (
    <div className="flex w-full flex-col border-y-[2px] border-grey-1 dark:border-grey-5 px-3 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="font-mont-bd text-lg dark:text-grey-1">{t('threads.new-thread')}</h1>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-grey-1 dark:bg-grey-5"
          onClick={postThread}
        >
          <CheckIcon className="h-5 w-5 dark:text-grey-1" />
        </button>
      </div>
      <div className="flex items-center gap-2 pb-1 pt-2">
        <h1 className="font-mont-md text-sm dark:text-grey-1">{t('threads.title')}:</h1>
        <input
          type="text"
          className={inputClass + " w-full"}
          value={threadTitle}
          onChange={(e) => setThreadTitle(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 pb-2 pt-1">
        <h1 className="font-mont-md text-sm dark:text-grey-1">{t('threads.friends')}:</h1>
        <input
          type="text"
          value={friendSearchQuery}
          onChange={(e) => {
            setFriendSearchQuery(e.target.value);
            handleSearchChange(e);
          }}
          className={inputClass + " w-[200px]"}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {friendsToAdd.length > 0 &&
          friendsToAdd.map((friend) => (
            <div
              key={friend.userId}
              className="flex h-6 items-center justify-center gap-1 rounded-full bg-grey-1 px-2 text-sm"
            >
              {friend.firstName}
              <button
                className="flex h-4 w-4 items-center justify-center rounded-full bg-grey-2"
                onClick={() => handleDeleteFriendToAdd(friend.userId)}
              >
                <CloseIcon className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
      </div>
      {friendSearchQuery.length > 0 && (
        <div
          className={`h-[${friends.length <= 4 ? friends.length * 50 : 200}] ${friends.length > 4 && "scroll overflow-y-scroll"
            }`}
        >
          {friends.length > 0 ? (
            <List
              className="w-full p-0 py-1 font-mont-md dark:bg-black"
            >
              {friends.map(
                (friend) =>
                  !friendsToAdd.includes(friend) && (
                    <ListItemButton
                      key={friend.userId}
                      className="rounded-lg px-2 py-2 hover:bg-grey-0 dark:hover:bg-grey-5"
                      onClick={() => onFriendSelect(friend)}
                    >
                      <div className="flex w-full items-center gap-[5px] overflow-x-hidden text-sm">
                        <img
                          src={getImage(friend.photo, DefaultPhoto)}
                          alt="user photo"
                          className="h-8 w-8 rounded-full"
                        />
                        <h1 className="dark:text-white">{friend.firstName}</h1>
                        <h1 className="dark:text-white">{friend.lastName}</h1>
                      </div>
                    </ListItemButton>
                  ),
              )}
            </List>
          ) : isLoadingFriends ? (
            <div className="flex flex-col items-center gap-2">
              <CircularProgress className="h-8 w-8 text-grey-2" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <h1 className="text-center text-sm italic text-grey-6 dark:text-grey-2">
                {t('general.no-results')}
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
        <Button
          id="NotificationsButton"
          className={`relative flex h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full bg-grey-1 dark:bg-grey-5 text-black dark:text-grey-1 ${isPressed && "text-primary dark:text-secondary"}`}
          onClick={pressHandler}
        >
          <CommentRoundedIcon className="h-[23px] w-[23px]" />
        </Button>
        {
          isPressed && (
            <div className="nav-dropdown flex h-[calc(100%-4.5rem)] w-[300px] flex-col items-center z-[1] bg-white dark:bg-black">
              <div className="flex h-14 w-full items-center justify-between px-3 py-2">
                <h1 className="font-mont-bd text-xl text-black dark:text-white">{t("threads.threads")}</h1>
                <Button
                  className={`flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-grey-1 dark:bg-grey-5 p-1 text-black ${isCreatingThread ? "text-primary dark:text-secondary" : "text-black dark:text-grey-1"}`}
                  onClick={toggleCreatingThread}
                >
                  <AddCommentRoundedIcon className="h-5 w-5" />
                </Button>
              </div>
              {isCreatingThread && renderNewThreadForm()}
              <div className="w-full px-3 py-3">
                <div className="flex h-10 w-full items-center rounded-full border-[1px] border-grey-1 dark:border-grey-6 bg-grey-0 dark:bg-grey-5 px-2 font-mont-md">
                  <input
                    type="text"
                    placeholder={t('threads.search')}
                    className="clean-input h-8 w-[250px] p-2 dark:placeholder:text-grey-2 dark:text-white"
                  />
                  <SearchIcon className="h-[25px] w-[25px] hover:cursor-pointer dark:text-grey-2" />
                </div>
              </div>
              <div id='scrollableDiv' className="flex h-full w-full items-center justify-center px-2 scroll overflow-y-auto">
                {renderThreadsContent()}
              </div>
            </div>
          )
        }
      </OutsideClickHandler>
      <div className={`absolute w-[675px] h-[400px] bottom-0 right-[0.5rem] z-[0] flex gap-2 ${(activeThreads.length === 0 && inactiveThreads.length === 0) && 'invisible'}`}>
        <div className={`w-full h-full flex flex-row-reverse gap-[15px]`}>
          {
            activeThreads.map((activeThread) => (
              <Thread key={activeThread.threadId} thread={activeThread} handleThreadClose={handleThreadClose} handleThreadMinimize={handleThreadMinimize} />
            ))
          }
        </div>
        <div className={`w-14 h-full flex flex-col-reverse py-4 gap-2`}>
          {
            inactiveThreads.map((inactiveThread) => (
              <InactiveThread key={inactiveThread.threadId} thread={inactiveThread} handleThreadMaximize={handleThreadMaximize} renderUserPhotos={renderUserPhotos} handleThreadClose={handleThreadClose} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Threads;
