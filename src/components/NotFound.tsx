import React from "react";
import SadEmoji from "../assets/images/emoji-sad.png"

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <img
          src={SadEmoji}
          alt="sad-emoji"
          className="h-[150px] min-w-[150px]"
        />
        <div className="p-5">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-lg mb-4">Page Not Found</p>
        </div>
    </div>
  );
};

export default NotFound;
