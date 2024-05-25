import React, { useState } from "react"
import LogoDark from "../../assets/images/LOGO-CLEAN-DARK.png";
import LogoLight from "../../assets/images/LOGO-CLEAN-LIGHT.png";
import LanguageChange from "./navItems/LanguageChange";
import Sections from "./navItems/MenuSections";
import Tools from "./navItems/Tools";

const NavBar: React.FC = () => {

    const [isDark, setIsDark] = useState(localStorage.theme === 'dark')


    return (
        <div className="h-14 w-full z-[2] shadow-md flex items-center dark:bg-black">
            <div className="w-full mx-2 flex items-center">
                <div className="flex-1 items-center">
                        {isDark ? 
                            (
                                <img src={LogoLight} alt="logo" className="h-12 min-w-[155px]" />     
                                ) : (   
                                <img src={LogoDark} alt="logo" className="h-12 min-w-[155px]" />     
                            )
                        }
                </div>
                
                <Sections/>
                       
                        
                <div className="flex-1 flex gap-2 justify-end items-center">
                    <Tools setIsDark={setIsDark}/>
                </div>
            </div>
        </div>
    )
}

export default NavBar