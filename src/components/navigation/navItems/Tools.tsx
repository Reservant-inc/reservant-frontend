import React, { useState } from "react";
import OutsideClickHandler from "../../reusableComponents/OutsideClickHandler";
import User from "../../../assets/images/user.jpg"
import { Icon } from "@mui/material";
import { AccountCircle, ArrowForward, ChevronLeft, ChevronRight, Error, Language, Logout, Settings } from "@mui/icons-material";
import Edit from "@mui/icons-material/Edit";
import { CSSTransition } from "react-transition-group";
import { redirect } from "react-router-dom";
import i18next from "i18next";

const Tools: React.FC = () => {

    const [isPressed, setIsPressed] = useState(false)
    const [isChanged, setIsChanged] = useState(false)

    const [activeMenu, setActiveMenu] = useState("main");

    const [menuHeight, setMenuHeight] = useState(288);

    function calcHeight(el: any){
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    const pressHandler = () => {
        setIsPressed(!isPressed)
    }

    const setLanguage = (lang: string) => {
        i18next.changeLanguage(lang)
        localStorage.setItem("i18nextLng", lang)
        setIsChanged(!isChanged)
    }

    function DropdownItem(props: any){

        const onClicked = () => {
            if(props.logout===true){
                //sign out logic
            }
            if(props.language)
                setLanguage(props.language)
            
            
            props.goToMenu && setActiveMenu(props.goToMenu)
            
        }
        return(   
            <div className=" p-2 ">
            <a href="#" className={props.className?props.className:"menu-item rounded-xl hover:bg-primary-2 text-black hover:text-white dark:text-grey-1 dark:hover:bg-secondary dark:hover:text-black  items-center h-14  p-2 flex flex"} onClick={onClicked}>
                <span className="icon-button">{props.leftIcon}</span>
                    <div className="p-1">
                        {props.children}
                    </div>
                <span className="icon-right ml-auto">{props.rightIcon}</span>
            </a>
            </div>
            
        )
    }
    

    return (
        <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
            <button
                className="h-10 w-10 flex justify-center items-center"
                onClick={pressHandler}
            >
                <img src={User} alt="logo" className="h-9 rounded-full" />
            </button>
            {
                isPressed &&
                <div style={{height: menuHeight}} className='dropdownMenu dark:bg-black'>
                    
                    <CSSTransition 
                        in={activeMenu === 'main'} 
                        unmountOnExit 
                        timeout={500}
                        classNames="menu-primary"
                        onEnter={calcHeight}
                        >
                        <div className="w-full" >   
                            <DropdownItem leftIcon={<AccountCircle />} > Profile </DropdownItem>
                            <DropdownItem leftIcon={<Settings />} rightIcon={<ChevronRight />} goToMenu="settings"> Settings </DropdownItem>
                            <DropdownItem leftIcon={<Language />} rightIcon={<ChevronRight />} goToMenu="languages"> Language </DropdownItem>
                            <DropdownItem leftIcon={<Logout />} logout={true}> Sign out </DropdownItem>
                            
                        </div>
                    </CSSTransition>    

                    <CSSTransition 
                        in={activeMenu === 'settings'} 
                        unmountOnExit 
                        timeout={500}
                        classNames="menu-secondary"
                        onEnter={calcHeight}

                        >
                        <div className="w-full" >   
                            <DropdownItem leftIcon={<ChevronLeft />} goToMenu="main"/>
                            <DropdownItem leftIcon={<Settings />}> SettingFiller1 </DropdownItem>
                            <DropdownItem leftIcon={<Settings />}> SettingFiller2 </DropdownItem>
                            <DropdownItem leftIcon={<Settings />}> SettingFiller3 </DropdownItem>
                            <DropdownItem leftIcon={<Settings />}> SettingFiller4 </DropdownItem>
                        </div>
                    </CSSTransition>

                    <CSSTransition 
                        in={activeMenu === 'languages'} 
                        unmountOnExit 
                        timeout={500}
                        classNames="menu-secondary"
                        onEnter={calcHeight}

                        >
                        <div className="w-full" >   
                            <DropdownItem leftIcon={<ChevronLeft />} goToMenu="main"/>
                            <DropdownItem leftIcon={<Language />} language="en" className={i18next.language === "en" ?"menu-item rounded-xl text-gray-1 cursor-default items-center h-14  p-2 flex flex dark:bg-secondary bg-primary-2 dark:text-black text-white ":""}> English </DropdownItem>
                            <DropdownItem leftIcon={<Language />} language="pl" className={i18next.language === "pl" ?"menu-item rounded-xl text-gray-1 cursor-default items-center h-14  p-2 flex flex dark:bg-secondary bg-primary-2 dark:text-black text-white ":""}> Polski </DropdownItem>
                        </div>
                    </CSSTransition>        
                </div>
            
            }
        </OutsideClickHandler>
    )
}

export default Tools