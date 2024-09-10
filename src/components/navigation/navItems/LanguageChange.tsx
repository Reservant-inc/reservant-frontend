import React, { useState } from "react";
import Language from "../../../assets/images/language.png";
import OutsideClickHandler from "../../reusableComponents/OutsideClickHandler";
import i18next from "i18next";

const LanguageChange: React.FC = () => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const pressHandler = () => {
    setIsPressed(!isPressed);
  };

  const setLanguage = (lang: string) => {
    i18next.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    setIsPressed(!isPressed);
  };

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <button
        id="LanguageChangeSelectionMenuButton"
        className={
          "flex h-10 w-10 items-center justify-center rounded-full bg-grey-1 dark:bg-grey-6" +
          (isPressed ? " bg-l-grey" : "")
        }
        onClick={pressHandler}
      >
        <svg
          className={
            "h-5" +
            (isPressed
              ? " fill-primary dark:fill-secondary"
              : " fill-grey-6 dark:fill-grey-2")
          }
          version="1.1"
          id="XMLID_275_"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24"
          xmlSpace="preserve"
        >
          <g id="language">
            <g>
              <path
                d="M12,24C5.4,24,0,18.6,0,12S5.4,0,12,0s12,5.4,12,12S18.6,24,12,24z M9.5,17c0.6,3.1,1.7,5,2.5,5s1.9-1.9,2.5-5H9.5z
                        M16.6,17c-0.3,1.7-0.8,3.3-1.4,4.5c2.3-0.8,4.3-2.4,5.5-4.5H16.6z M3.3,17c1.2,2.1,3.2,3.7,5.5,4.5c-0.6-1.2-1.1-2.8-1.4-4.5H3.3
                        z M16.9,15h4.7c0.2-0.9,0.4-2,0.4-3s-0.2-2.1-0.5-3h-4.7c0.2,1,0.2,2,0.2,3S17,14,16.9,15z M9.2,15h5.7c0.1-0.9,0.2-1.9,0.2-3
                        S15,9.9,14.9,9H9.2C9.1,9.9,9,10.9,9,12C9,13.1,9.1,14.1,9.2,15z M2.5,15h4.7c-0.1-1-0.1-2-0.1-3s0-2,0.1-3H2.5C2.2,9.9,2,11,2,12
                        S2.2,14.1,2.5,15z M16.6,7h4.1c-1.2-2.1-3.2-3.7-5.5-4.5C15.8,3.7,16.3,5.3,16.6,7z M9.5,7h5.1c-0.6-3.1-1.7-5-2.5-5
                        C11.3,2,10.1,3.9,9.5,7z M3.3,7h4.1c0.3-1.7,0.8-3.3,1.4-4.5C6.5,3.3,4.6,4.9,3.3,7z"
              />
            </g>
          </g>
        </svg>
      </button>
      {isPressed && (
        <div className="absolute right-[0.5rem] top-[4rem]  flex h-20 w-32 flex-col items-center justify-around rounded bg-white text-black drop-shadow-xl dark:bg-black dark:text-white">
          <button
            id="LanguageChangeEnglishButton"
            className={
              "h-5/12 w-[95%] rounded-sm p-1 text-left transition hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black" +
              (i18next.language === "en"
                ? " bg-primary text-white dark:bg-secondary dark:text-black"
                : "")
            }
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            id="LanguageChangePolishButton"
            className={
              "h-5/12 w-[95%] rounded-sm p-1 text-left transition hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black" +
              (i18next.language === "pl"
                ? " bg-primary text-white dark:bg-secondary dark:text-black"
                : "")
            }
            onClick={() => setLanguage("pl")}
          >
            Polski
          </button>
        </div>
      )}
    </OutsideClickHandler>
  );
};

export default LanguageChange;
