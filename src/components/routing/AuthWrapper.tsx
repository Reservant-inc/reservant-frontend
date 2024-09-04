import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { nav } from "./Routing";
import Cookies from "js-cookie";
import { LoginResponseType } from "../../services/types";
import NavBar from "../navigation/NavBar";
import { FetchError } from "../../services/Errors";
import { fetchGET } from "../../services/APIconn";

export const AuthContext = createContext({
  authorized: false,
  login: (token: LoginResponseType) => {},
  logout: () => {},
  setAuthorized: (auth: boolean) => {},
});

export const AuthData = () => {
  const authData = useContext(AuthContext);
  if (!authData) {
    throw new Error("useAuthData must be used within an AuthProvider");
  }
  return authData;
};

export const AuthWrapper = () => {
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(
    !(Cookies.get("token") === undefined),
  );

  useEffect(() => {
    if (authorized) {
      <Navigate to={"/home"} />;
    }
  });

  const login = async (data: LoginResponseType) => {
    Cookies.set("token", data.token, { expires: 1 });

    try {
      const userInfo = await fetchGET('/user')

      Cookies.set(
        "userInfo",
        JSON.stringify({
          userId: userInfo.userId,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          roles: userInfo.roles,
          photo: userInfo.photo
        }),
        { expires: 1 },
      );

    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log("unexpected error")
      }
    }
    
    setAuthorized(true);
    navigate("/home");
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    setAuthorized(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ authorized, login, setAuthorized, logout }}>
      <Routes>
        {nav.map((r, i) => {
          if (r.isPrivate) {
            if (
              authorized &&
              r.roles.some((item) =>
                JSON.parse(Cookies.get("userInfo") as string).roles.includes(
                  item,
                ),
              )
            ) {
              return (
                <Route
                  key={i}
                  path={r.path}
                  element={
                    <div className="flex h-full w-full flex-col">
                      <NavBar />
                      {r.element}
                    </div>
                  }
                />
              );
            } else {
              return (
                <Route
                  key={i}
                  path={r.path}
                  element={<Navigate to={"/user/login"} />}
                />
              );
            }
          } else if (!r.isPrivate) {
            if (authorized) {
              return (
                <Route
                  key={i}
                  path={r.path}
                  element={<Navigate to={"/home"} />}
                />
              );
            } else {
              return <Route key={i} path={r.path} element={r.element} />;
            }
          } else return false;
        })}
      </Routes>
    </AuthContext.Provider>
  );
};
