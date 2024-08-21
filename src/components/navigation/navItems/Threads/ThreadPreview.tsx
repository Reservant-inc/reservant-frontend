import React, { useEffect } from "react";
import { ThreadType } from "../../../../services/types";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button } from "@mui/material";
import { fetchGET } from "../../../../services/APIconn";

interface ThreadPreviewProps {
  thread: ThreadType;
}

const ThreadPreview: React.FC<ThreadPreviewProps> = (thread) => {
  useEffect(() => {
    const getThreadInfo = async () => {
      try {
        //const result = fetchGET(`/threads/${}`)
      } catch (error) {
        console.log(error);
      }
    };

    getThreadInfo();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div></div>
      <Button>
        <MoreHorizIcon />
      </Button>
    </div>
  );
};

export default ThreadPreview;
