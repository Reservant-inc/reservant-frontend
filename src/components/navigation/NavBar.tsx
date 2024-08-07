import React, { useState } from "react";
import LogoDark from "../../assets/images/LOGO-DARK.png";
import LogoLight from "../../assets/images/LOGO-CLEAN-LIGHT.png";
import Sections from "./navItems/MenuSections";
import Tools from "./navItems/Tools";
import NotificationsButton from "./navItems/Notifications/NotificationsButton";
import FriendSearchBar from "./navItems/Friends/FriendSearchBar";
import Threads from "./navItems/Threads/Threads";

const NavBar: React.FC = () => {
  const [isDark, setIsDark] = useState(localStorage.theme === "dark");

  return (
    <div className="z-[2] flex h-[55px] w-full items-center shadow-md dark:bg-black">
      <div className="flex h-full w-full items-center p-1 mx-1">
        <div className="h-full flex-1 flex items-center">
          {isDark ? (
            <img src={LogoDark} alt="logo" className="h-12 min-w-[155px] rounded-full" />
          ) : (
            <img src={LogoLight} alt="logo" className="h-[45px] min-w-[45px]" />
          )}
        </div>

        <Sections />

        <div className="flex h-full flex-1 items-center justify-end gap-3">
          <FriendSearchBar />
          <Threads />
          <NotificationsButton isDark={isDark} />
          <Tools setIsDark={setIsDark} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
