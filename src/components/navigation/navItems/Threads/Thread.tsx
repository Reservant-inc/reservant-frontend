import React, { useEffect, useState, useRef } from "react";
import { MessageType, PaginationType, ThreadType } from "../../../../services/types";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { fetchGET, fetchPOST } from "../../../../services/APIconn";
import { FetchError } from "../../../../services/Errors";
import { CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import DefaultUser from "../../../../assets/images/user.jpg";

interface ThreadProps {
  thread: ThreadType;
}

const Thread: React.FC<ThreadProps> = ({ thread }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const getMessages = async () => {
    try {
      const result: PaginationType = await fetchGET(`/threads/${thread.threadId}/messages?page=${page}&perPage=20`);
      const newMessages: MessageType[] = result.items as MessageType[];

      if (newMessages.length < 20) setHasMore(false);

      if (page > 0) {
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      } else {
        setMessages(newMessages);
      }
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors());
      } else {
        console.log("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    getMessages();
  }, [page]);

  // Scroll to the bottom on the initial load
  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    try {
      await fetchPOST(`/threads/${thread.threadId}/messages`, JSON.stringify({ contents: message }));
      setPage(0);
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors());
      } else {
        console.log("Unexpected error:", error);
      }
    } finally {
      setMessageToSend("");
    }
  };

  return (
    <div className="h-[calc(100%-3rem)] w-full z-[0]">
      {isEditing ? (
        <div>
          {/* Editing logic here */}
        </div>
      ) : (
        <div className="flex flex-col h-full w-full">
          <div id="scrollableDiv" className="h-full w-full overflow-y-auto scroll grid items-end pb-1" ref={scrollableDivRef}>
            <InfiniteScroll
              dataLength={messages.length}
              next={() => setPage((prevPage) => prevPage + 1)}
              hasMore={hasMore}
              loader={<CircularProgress />}
              scrollableTarget="scrollableDiv"
              className="px-2 hidescroll"
              inverse={true}
            >
              <div className="h-full w-full flex flex-col-reverse gap-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 w-full ${
                      index % 2 === 0 ? "self-start" : "self-end flex-row-reverse"
                    }`}
                  >
                    <img className="h-6 w-6 rounded-full" src={DefaultUser} />
                    <h1
                      className={`text-sm rounded-lg break-words max-w-[70%] p-2 ${
                        index % 2 === 0 ? "bg-grey-1" : "bg-primary text-white"
                      }`}
                    >
                      {message.contents}
                    </h1>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
          <div className="flex items-center justify-between h-12 w-full p-2 gap-2 relative">
            <div
              className={`border-[1px] border-grey-1 bg-grey-0 rounded-full transition-all duration-300 ${
                messageToSend.length > 0 ? "w-[calc(100%-48px)]" : "w-full"
              }`}
            >
              <input
                type="text"
                placeholder="Send a message"
                value={messageToSend}
                onChange={(e) => setMessageToSend(e.target.value)}
                className="text-sm w-full"
              />
            </div>
            <button
              className={`absolute p-2 hover:bg-grey-0 hover:text-primary rounded-full h-10 flex items-center justify-center fade-in right-2 ${
                messageToSend.length > 0 ? "opacity-100" : "opacity-0 z-[-1]"
              }`}
              onClick={() => handleSendMessage(messageToSend)}
            >
              <SendRoundedIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Thread;
