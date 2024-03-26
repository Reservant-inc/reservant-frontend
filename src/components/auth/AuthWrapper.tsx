import React, { createContext, useContext, useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom";
import { nav } from "../navigation/Navigation";
import Cookies from "js-cookie";

interface AuthContextValue {
    isAuthenticated: boolean;
    login: (login: string, password: string) => void;
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
    
    const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false)

    useEffect(() => {
        
    }, [isAuthenticated])

    const login = (login: string) => {
       setIsAuthenticated(true)
    }

    const logout = () => {
        //TODO: logout
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            <Routes>
            { 

                nav.map((r, i) => {
                    
                    if (r.isPrivate) {
                        if (isAuthenticated) {
                            return <Route key={i} path={r.path} element={r.element}/>
                        } else {
                            return <Route key={i} path={r.path} element={ <Navigate to={"/auth/login"}/> }/>
                        }
                    } else if (!r.isPrivate) {
                        if (isAuthenticated) {
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