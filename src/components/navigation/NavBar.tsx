import React from "react"
import Logo from "../../assets/images/logo.png";
import ThemeButton from "./navItems/ThemeButton";
import LanguageChange from "./navItems/LanguageChange";
import AuthItems from "./navItems/AuthItems";
import Section from "./navItems/Section";
import Cookies from "js-cookie";

const NavBar: React.FC = () => {

    return (
        <div className="h-[4.5rem] w-full bg-cream relative shadow-md flex items-center">
            <div className="w-full mx-2 flex justify-between">
                <div>
                    <img src={Logo} alt="logo" className="h-12" />
                </div>
                <div>
                    <Section name="Home" connString="/"/>
                    <Section name="My restaurants" connString={`/${JSON.parse(Cookies.get('userInfo') as string).login}/restaurants`}/>
                </div>
                <div className="flex">
                    <ThemeButton/>
                    <LanguageChange />
                    <AuthItems />
                </div>
            </div>
        </div>
    )
}

export default NavBar