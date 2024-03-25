import React, { createContext, useContext, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom";
import { nav } from "../navigation/Navigation";

interface AuthContextValue {
    user: { name: string; isAuthenticated: boolean };
    login: (login: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const AuthData = (): AuthContextValue => {
    const authData = useContext(AuthContext);
    if (!authData) {
      throw new Error("useAuthData must be used within an AuthProvider");
    }
    return authData;
  };

export const AuthWrapper = () => {

    const [ user, setUser ] = useState({name: "", isAuthenticated: false})

    const login = (login: string, password: string): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_IP}/auth/login`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        login: login,
                        password: password,
                        rememberMe: false
                    }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                reject(new Error("Invalid login data"));
                return;
            }

            const data = await response.json();
            setUser({name: login, isAuthenticated: true})
            localStorage.setItem('userInfo', JSON.stringify(data));
            console.log(localStorage.getItem("userInfo"));

            resolve();
        })
    }

    const logout = () => {
        //TODO: logout
        setUser({...user, isAuthenticated: false})
    }


    return (
        <AuthContext.Provider value={{user, login, logout}}>
            <Routes>
            { nav.map((r, i) => {
                  
                  if (r.isPrivate) {
                    if (user.isAuthenticated) {
                        return <Route key={i} path={r.path} element={r.element}/>
                    } else {
                        return <Route key={i} path={r.path} element={ <Navigate to={"/auth/login"}/> }/>
                    }
                  } else if (!r.isPrivate) {
                       return <Route key={i} path={r.path} element={r.element}/>
                  } else return false

             })}
             
             </Routes>
        </AuthContext.Provider>
    )
}