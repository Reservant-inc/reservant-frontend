import React, { useEffect } from "react";
import { AuthWrapper } from "../components/routing/AuthWrapper";

const App = () => {
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div id="AppWrapper" className="App font-mont-md">
      <div id="AppMainSection" className="h-screen">
        <AuthWrapper />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
