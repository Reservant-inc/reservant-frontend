import React, { useState } from "react";
import LogoSecondary from "../../assets/images/LOGO-SECONDARY.png";
import LogoPrimary from "../../assets/images/LOGO-PRIMARY.png";
import Sections from "./navItems/MenuSections";
import Tools from "./navItems/Tools";
import Notifications from "./navItems/Notifications/Notifications";
import FriendSearchBar from "./navItems/Friends/FriendSearchBar";
import Threads from "./navItems/Threads/Threads";

const NavBar: React.FC = () => {
  const [isDark, setIsDark] = useState(localStorage.theme === "dark");

  return (
    <div className="z-[2] flex h-[55px] w-full items-center shadow-md dark:bg-black">
      <div className="mx-1 flex h-full w-full items-center p-1">
        <div className="flex h-full flex-1 items-center gap-2">
          {isDark ? (
            <img
              src={LogoSecondary}
              alt="logo"
              className="h-[45px] min-w-[45px]"
            />
          ) : (
            <img
              src={LogoPrimary}
              alt="logo"
              className="h-[45px] min-w-[45px]"
            />
          )}
          <h1
            className={
              "font-mont-md text-xl" +
              (isDark ? " text-secondary" : " text-primary")
            }
          >
            RESERVANT
          </h1>
        </div>

        <Sections />

        <div className="flex h-full flex-1 items-center justify-end gap-3">
          <FriendSearchBar />
          <Threads />
          <Notifications isDark={isDark} />
          <Tools setIsDark={setIsDark} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
