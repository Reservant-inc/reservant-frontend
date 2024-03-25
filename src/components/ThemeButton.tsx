import React, {useState} from "react";

function ThemeButton() {


    const [isDark, setIsDark] = useState<boolean>(false);
    

    //simple function for changing theme
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    //TODO changing icons instead of text
      <button onClick={toggleTheme} className="bg-black text-white dark:bg-white dark:text-black"> {`${isDark?"light mode":"dark mode"}`} </button>
  );
}

export default ThemeButton;
