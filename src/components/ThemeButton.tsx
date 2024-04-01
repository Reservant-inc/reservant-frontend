import React, {useState} from "react";

function ThemeButton() {

    //simple function for changing theme
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    console.log(document.documentElement.className==="dark")
  };


      //simple function for changing theme according to users preffered os settings
  const OSTheme = () => {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches && !(document.documentElement.className==="dark"))
    {
      document.documentElement.classList.toggle("dark");
    }

  };

  return (
    //TODO strong suggestion to make it list like with language choice, but with icons so its cooler
    <>
      <button onClick={toggleTheme} className="bg-black text-white dark:bg-white dark:text-black"> dark mode </button>
      <br/>
      <button onClick={toggleTheme} className="bg-black text-white dark:bg-white dark:text-black"> light mode </button>
      <br/>
      <button onClick={OSTheme} className="bg-black text-white dark:bg-white dark:text-black"> osTheme </button>
    </>
  );
}

export default ThemeButton;
