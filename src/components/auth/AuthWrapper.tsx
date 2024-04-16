import React, { createContext, useContext, useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { nav } from "../navigation/Navigation";
import Cookies from "js-cookie";

interface AuthContextValue {
    isAuthorized: boolean;
    login: (token: string) => void;
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

    const navigate = useNavigate()

    const [isAuthorized, setIsAuthorized] = useState(!(Cookies.get("token") === undefined))
    
    useEffect(() => {
        if(isAuthorized){
            <Navigate to={"/home"} />
        }
    })

    const login = (token: string) => {
        Cookies.set("token", token, { expires: 1})
        setIsAuthorized(true)
        navigate("/home");
    }

    const logout = () => {
        Cookies.remove("token")
        setIsAuthorized(false)
        navigate("/")
    }

    return (
        <AuthContext.Provider value={{isAuthorized, login, logout}}>
            <Routes>
            { 

                nav.map((r, i) => {
                    
                    if (r.isPrivate) {
                        if (isAuthorized && r.roles.some(item => JSON.parse(Cookies.get("userInfo") as string).roles.includes(item))) {
                            return <Route key={i} path={r.path} element={r.element}/>
                        } else {
                            return <Route key={i} path={r.path} element={ <Navigate to={"/user/login"}/> }/>
                        }
                    } else if (!r.isPrivate) {
                        if (isAuthorized) {
                            return <Route key={i} path={r.path} element={ <Navigate to={"/home"}/> }/>
                        } else {
                            return <Route key={i} path={r.path} element={r.element}/>
                        }
                    } else return false

                })
            }
             
             </Routes>
        </AuthContext.Provider>
    )
}