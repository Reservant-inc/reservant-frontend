import React, { ReactNode, useState } from "react";

// Flexible Popup Modal component, can add more props for more flexiblity in the future if neccessary

interface PopupProps {
    children: ReactNode;
    buttonText?: String;
    bgColor?: String;
    modalTitle?: String;
}

const Popup: React.FC<PopupProps> = ({ children, buttonText = "Click", bgColor = "black", modalTitle = "" }) => {
    const [isPopupPressed, setIsPopupPressed] = useState<boolean>(false);

    const handlePopupToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsPopupPressed((isPressed) => !isPressed);
    };

    const handleBackgroundToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if(isPopupPressed) {
            setIsPopupPressed(false);
        }
    }

    return (
        <div 
        className="p-10 flex justify-center w-full"
        onClick={handleBackgroundToggle}>
            <button 
            className={`border rounded-lg py-1.5 px-10 my-2 bg-${bgColor} text-black`}
            onClick={handlePopupToggle}>{buttonText}</button>
            {isPopupPressed && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-grey opacity-50"></div>
                        <div className="relative bg-white p-8 rounded shadow-lg w-1/2"  onClick={(e) => e.stopPropagation()}>
                                <span
                                    className="absolute top-0 right-0 m-4 cursor-pointer text-xl"
                                    onClick={handlePopupToggle}
                                >
                                    &times;
                                </span>
                                {modalTitle && (
                                    <h2 className={`text-xl mb-4 text-black`}>{modalTitle}</h2>
                                )}
                            <div className="p-8">{children}</div>
                        </div>
                    </div>
            )}
        </div>
    );
};

export default Popup;
