import React, { ReactNode, useState } from "react";

interface PopupProps {
  children: ReactNode;
  buttonText?: String;
  bgColor?: String;
  modalTitle?: String;
}

const Popup: React.FC<PopupProps> = ({
  children,
  buttonText = "Click",
  bgColor = "black",
  modalTitle = "",
}) => {
  const [isPopupPressed, setIsPopupPressed] = useState<boolean>(false);

  const handlePopupToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPopupPressed((isPressed) => !isPressed);
  };

  const handleBackgroundToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isPopupPressed) {
      setIsPopupPressed(false);
    }
  };

  return (
    <div
      className="flex w-full justify-center p-10"
      onClick={handleBackgroundToggle}
    >
      <button
        id="PopupTogglePopupButton"
        className={`my-2 rounded-lg border px-10 py-1.5 bg-${bgColor} text-black`}
        onClick={handlePopupToggle}
      >
        {buttonText}
      </button>
      {isPopupPressed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-grey absolute inset-0 opacity-50"></div>
          <div
            className="relative w-1/2 rounded bg-white p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="absolute right-0 top-0 m-4 cursor-pointer text-xl"
              onClick={handlePopupToggle}
            >
              &times;
            </span>
            {modalTitle && (
              <h2 className={`mb-4 text-xl text-black`}>{modalTitle}</h2>
            )}
            <div className="p-8">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
