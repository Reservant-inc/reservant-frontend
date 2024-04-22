import React, { useState } from "react"
import LogoDark from "../../assets/images/LOGO-CLEAN-DARK.png";
import LogoLight from "../../assets/images/LOGO-CLEAN-LIGHT.png";
import {ReactComponent as HomeIcon } from "../../assets/images/home.svg"
import ThemeButton from "./navItems/ThemeButton";
import LanguageChange from "./navItems/LanguageChange";
import AuthItems from "./navItems/AuthItems";
import Section from "./navItems/Section";
import Cookies from "js-cookie";

const NavBar: React.FC = () => {

    const [isDark, setIsDark] = useState(localStorage.theme === 'dark')

    return (
        <div className="h-14 w-full relative shadow-md flex items-center dark:bg-black">
            <div className="w-full mx-2 flex items-center">
                <div className="flex-1 items-center">
                        {isDark ? 
                            (
                                <img src={LogoLight} alt="logo" className="h-12" />     
                                ) : (   
                                <img src={LogoDark} alt="logo" className="h-12" />     
                            )
                        }
                </div>
                <div className="h-full flex gap-1 items-center">
                    <Section 
                        component=
                        {
                            <HomeIcon/>
                        } 
                        connString="/home"/>
                    <Section 
                        component=
                        {
                            <div> 
                                
                            </div>
                        }  
                        connString={`/${JSON.parse(Cookies.get('userInfo') as string).login}/restaurants`}/>
                </div>
                <div className="flex-1 flex justify-end items-center">
                    <ThemeButton setIsDark={setIsDark}/>
                    <LanguageChange/>
                    <AuthItems />
                </div>
            </div>
        </div>
    )
}

export default NavBar