import React, { useState } from "react";
import OutsideClickHandler from "../../reusableComponents/OutsideClickHandler";
import User from "../../../assets/images/user.jpg"
import { Icon } from "@mui/material";
import { ArrowForward, ChevronLeft, ChevronRight, Error } from "@mui/icons-material";
import Edit from "@mui/icons-material/Edit";
import { CSSTransition } from "react-transition-group";

const Tools: React.FC = () => {

    const [isPressed, setIsPressed] = useState(false)

    const [activeMenu, setActiveMenu] = useState("main");

    const [menuHeight, setMenuHeight] = useState(600);

    function calcHeight(el: any){
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    const pressHandler = () => {
        setIsPressed(!isPressed)
    }

    function DropdownItem(props: any){
        return(
            <a href="#" className="menu-item hover:bg-secondary p-2 flex " onClick={()=> props.goToMenu && setActiveMenu(props.goToMenu)}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}
                <span className="icon-right ml-auto">{props.rightIcon}</span>
            </a>
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
                <div style={{height: menuHeight}} className='absolute w-36 bg-white text-black dark:bg-black dark:text-white top-[4rem] right-[0.5rem] drop-shadow-xl rounded flex flex-col align-center justify-top overflow-hidden p-4'>
                    
                    <CSSTransition 
                        in={activeMenu === 'main'} 
                        unmountOnExit 
                        timeout={500}
                        className="menu-primary"
                        onEnter={calcHeight}
                        >
                        <div className="menu" >   
                            <DropdownItem leftIcon={<Error />} rightIcon={<ChevronRight />} goToMenu="settings"> asd </DropdownItem>
                            <DropdownItem leftIcon={<Error />} > a </DropdownItem>
                        </div>
                    </CSSTransition>    

                    <CSSTransition 
                        in={activeMenu === 'settings'} 
                        unmountOnExit 
                        timeout={500}
                        className="menu-secondary"
                        onEnter={calcHeight}

                        >
                        <div className="menu" >   
                            <DropdownItem leftIcon={<ChevronLeft />} goToMenu="main"/>
                            <DropdownItem leftIcon={<Error />}> a </DropdownItem>
                            <DropdownItem leftIcon={<Error />}> a </DropdownItem>
                            <DropdownItem leftIcon={<Error />}> a </DropdownItem>
                            <DropdownItem leftIcon={<Error />}> a </DropdownItem>
                            <DropdownItem leftIcon={<Error />}> a </DropdownItem>
                            <DropdownItem leftIcon={<Error />}> a </DropdownItem>
                            <DropdownItem leftIcon={<Error />}> a </DropdownItem>
                            <DropdownItem leftIcon={<Error />}> a </DropdownItem>
                        </div>
                    </CSSTransition>    
                </div>
            
            }
        </OutsideClickHandler>
    )
}

export default Tools