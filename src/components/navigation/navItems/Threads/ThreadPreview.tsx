import React, { useEffect, useState } from "react";
import { ThreadType } from "../../../../services/types";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getImage } from "../../../../services/APIconn";
import DefaultUser from "../../../../assets/images/user.jpg"
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";

interface ThreadPreviewProps {
  thread: ThreadType;
  renderUserPhotos: Function;
}

const ThreadPreview: React.FC<ThreadPreviewProps> = ({ thread, renderUserPhotos }) => {

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
              {renderUserPhotos(updatedThread)}
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
