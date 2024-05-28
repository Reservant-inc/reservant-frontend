import React, { useState } from "react";
import LogoDark from "../../assets/images/LOGO-CLEAN-DARK.png";
import LogoLight from "../../assets/images/LOGO-CLEAN-LIGHT.png";
import LanguageChange from "./navItems/LanguageChange";
import Sections from "./navItems/MenuSections";
import Tools from "./navItems/Tools";

const NavBar: React.FC = () => {
  const [isDark, setIsDark] = useState(localStorage.theme === "dark");

  return (
    <div className="z-[2] flex h-14 w-full items-center shadow-md dark:bg-black">
      <div className="mx-2 flex h-full w-full items-center">
        <div className="flex-1 h-full items-center">
          {isDark ? (
            <img src={LogoLight} alt="logo" className="h-12 min-w-[155px]" />
          ) : (
            <img src={LogoDark} alt="logo" className="h-[95%]" />
          )}
        </div>

        <Sections />

        <div className="h-full flex flex-1 items-center justify-end gap-2">
          <Tools setIsDark={setIsDark} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
