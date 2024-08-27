import React, { useEffect, useState } from "react";
import { ThreadType } from "../../../../services/types";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getImage } from "../../../../services/APIconn";
import DefaultUser from "../../../../assets/images/user.jpg"
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";

interface ThreadPreviewProps {
  thread: ThreadType;
}

const ThreadPreview: React.FC<ThreadPreviewProps> = ({ thread }) => {

  const [updatedThread, setUpdatedThread] = useState<ThreadType | null>(null)

  useEffect(() => {
    const currentUserId = JSON.parse(Cookies.get("userInfo") as string).userId
    thread.participants = thread.participants.filter((participant) => participant.userId !== currentUserId)
    setUpdatedThread(thread)
  }, [])

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {
        updatedThread && (
          <>
            <div className="flex gap-3 items-center">
              {
                thread.participants.length > 1 ? (
                  <div className="relative w-12 h-12">
                    <div className="absolute h-8 w-8 flex items-center justify-center bg-white z-[0] top-0 right-0 rounded-full">
                      <img src={getImage(updatedThread.participants[0].photo, DefaultUser)} className="absolute h-7 w-7 rounded-full"/>
                    </div>
                    <div className="absolute h-8 w-8 flex items-center justify-center bg-white z-[1] bottom-0 left-0 rounded-full">
                      <img src={getImage(updatedThread.participants[0].photo, DefaultUser)} className="absolute h-7 w-7 rounded-full"/>
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src={getImage(updatedThread.participants[0].photo, DefaultUser)} className="h-8 w-8 rounded-full"/>
                  </div>
                )
              }
              <h1 className="text-sm">
                {thread.title}
              </h1>
            </div>
            <button>
              <MoreHorizIcon />
            </button>
          </>
        )
      }
    </div>
  );
};

export default ThreadPreview;
