import React, { useEffect } from "react";
import { AuthWrapper } from "../components/routing/AuthWrapper";

const App = () => {

  useEffect(()=>{
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  return (
      <div className="App font-mont">
        <div className="flex flex-col items-center bg-l-grey h-screen">
          <AuthWrapper />
        </div>
        {/* <Footer /> */}
      </div>  
    )
}

export default App