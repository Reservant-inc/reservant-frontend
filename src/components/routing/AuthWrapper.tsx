import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { nav } from "./Routing";
import Cookies from "js-cookie";
import { LoginResponseType } from "../../services/types";
import NavBar from "../navigation/NavBar";

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

  const login = (data: LoginResponseType) => {
    Cookies.set("token", data.token, { expires: 1 });

    Cookies.set(
      "userInfo",
      JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles,
        userId: data.userId,
      }),
      { expires: 1 },
    );

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
