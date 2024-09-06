import React, { useContext, useState } from "react";
import OutsideClickHandler from "../../reusableComponents/OutsideClickHandler";
import User from "../../../assets/images/user.jpg";
import { Icon, Switch, alpha, createTheme, styled } from "@mui/material";
import {
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  DarkMode,
  Language,
  LightMode,
  Logout,
  Settings,
} from "@mui/icons-material";
import { CSSTransition } from "react-transition-group";
import i18next from "i18next";
import { ThemeProvider } from "@emotion/react";
import { AuthContext, AuthData } from "../../routing/AuthWrapper";
import { useTranslation } from "react-i18next";
import Tooltip from '@mui/material/Tooltip';

export interface ToolsProps {
  setIsDark: Function;
}

const Tools: React.FC<ToolsProps> = ({setIsDark}) => {
    const[isThemeAreaHovered, setIsThemeAreaHovered] = useState(false);
    const [t, i18n] = useTranslation("global");
    
    const [isPressed, setIsPressed] = useState(false)
    const [isChanged, setIsChanged] = useState(false)
    const [activeMenu, setActiveMenu] = useState("main");

    const mainHeight=360

    const [menuHeight, setMenuHeight] = useState(mainHeight);

    const { logout } = AuthData();

    const theme = createTheme({
        components: {
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                color: "#222222",
              },
              colorPrimary: {
                "&.Mui-checked": {
                color: "#64c3a6",
                }
              },
              track: {
                backgroundColor: "#222222",
                ".Mui-checked.Mui-checked + &": {
                    backgroundColor: "#b1e1d2",
                }
              }
            }
          }
        }
    })
  const toggleTheme = () => {
      if(!(document.documentElement.className==="dark"))
      {
        localStorage.theme = "dark";
        document.documentElement.classList.add('dark')
  
        setIsDark(true);
        return;
      }
      localStorage.theme="light";
      document.documentElement.classList.remove('dark')
      setIsDark(false);
    };
  

  function calcHeight(el: any){
      const height = el.offsetHeight;
      setMenuHeight(height);
  }
      
  const handleLogout = () => logout();

  const pressHandler = () => {
    setIsPressed(!isPressed);
  };

  const setLanguage = (lang: string) => {
    i18next.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    setIsChanged(!isChanged);
  };

  function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      handleLogout();
    }
  }
    function DropdownItem(props: any){

        const onClicked = () => {
            if(props.logout===true){
                deleteAllCookies()
            }
            
            props.goToMenu && setActiveMenu(props.goToMenu)
            
            
            if(props.language){
              setLanguage(props.language)
              setIsPressed(false)
              setMenuHeight(mainHeight);
            }

        }

        return(   
            <div className=" p-2 ">
                <a onMouseEnter={()=> {if(props.id==="ThemeDropdownItem"){setIsThemeAreaHovered(true)}}}onMouseLeave={()=> {if(props.id==="ThemeDropdownItem"){setIsThemeAreaHovered(false)}}} href="#" id={props.id} className={props.className?props.className:"rounded-lg menu-item hover:bg-grey-1 text-black dark:text-grey-1 dark:hover:bg-grey-5 items-center h-14 p-2 flex flex" } onClick={onClicked}>
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
          <Tooltip title="Open Tools" arrow>
                <button
                    id="ToolsButton"
                    className="h-10 w-10 flex justify-center items-center"
                    onClick={pressHandler}
                >
                    <img src={User} alt="user" className="rounded-full" />
                </button>
            </Tooltip>
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
                        <ThemeProvider theme={theme}>
                        
                            <DropdownItem leftIcon={<AccountCircle/>} id="profileDropdownItem" > {t("tools.main.profile")} </DropdownItem>
                            <DropdownItem leftIcon={<Settings />} rightIcon={<ChevronRight /> }id="settingsDropdownItem" goToMenu="settings"> {t("tools.main.settings")} </DropdownItem>
                            <DropdownItem leftIcon={<Language />} rightIcon={<ChevronRight />} goToMenu="languages" id="languagesDropdownItem"> {t("tools.main.language")} </DropdownItem>
                            <DropdownItem className="menu-item rounded-lg cursor-default hover:bg-grey-1 text-black dark:text-grey-1 dark:hover:bg-grey-5 items-center h-14  p-2 flex flex"
                                leftIcon={document.documentElement.className==="dark"?<DarkMode/>:<LightMode/>} rightIcon={<Switch onClick={toggleTheme} id="ToolsThemeSwitch" className="ToolsThemeSwitch" defaultChecked={document.documentElement.className==="dark"} />}  id="ThemeDropdownItem"> {t("tools.main.mode")} </DropdownItem>
                            <DropdownItem leftIcon={<Logout />} id="logoutDropdownItem" logout={true}> {t("tools.main.signout")} </DropdownItem>
                        </ThemeProvider>
                       
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
                            <DropdownItem leftIcon={<ChevronLeft />} id="backFromSettingsDropdownItem" goToMenu="main"/>
                            <DropdownItem leftIcon={<Settings />} id="SettingFiller1DropdownItem"> {t("tools.settings.setting")} </DropdownItem>
                            <DropdownItem leftIcon={<Settings />}id="SettingFiller2DropdownItem"> {t("tools.settings.setting")} </DropdownItem>
                            <DropdownItem leftIcon={<Settings />}id="SettingFiller3DropdownItem"> {t("tools.settings.setting")} </DropdownItem>
                            <DropdownItem leftIcon={<Settings />}id="SettingFiller4DropdownItem"> {t("tools.settings.setting")} </DropdownItem>
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
                            <DropdownItem leftIcon={<ChevronLeft />}id="backFromLanguagesDropdownItem" goToMenu="main"/>
                            <DropdownItem leftIcon={<Language />} goToMenu="main" id="EnglishDropdownItem" language="en" className={i18next.language === "en" ?"menu-item rounded-lg cursor-default items-center h-14  p-2 flex flex dark:bg-grey-5 bg-grey-1 dark:text-grey-1 text-black ":""}> English </DropdownItem>
                            <DropdownItem leftIcon={<Language />} goToMenu="main" id="PolishDropdownItem" language="pl" className={i18next.language === "pl" ?"menu-item rounded-lg cursor-default items-center h-14  p-2 flex flex dark:bg-grey-5 bg-grey-1 text-black dark:text-grey-1 ":""}> Polski </DropdownItem>
                        </div>
                    </CSSTransition>        
                </div>
            
            }
            </OutsideClickHandler>
    );
  }


export default Tools
