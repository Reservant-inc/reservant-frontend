import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import Cookies from "js-cookie";
import LoginValidator from "./LoginValidator";
import PasswordValidator from "./PasswordValidator";
import './Login.css';

const Login = ({ updateStatus }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
  const [isLoginValid, setIsLoginValid] = useState<boolean>(false); 
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const [isLoginFocused, setIsLoginFocused] = useState(false); 
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Activate the submit button only if both password and login are validated
  useEffect(() => {
    if (isLoginValid && isPasswordValid) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [isLoginValid, isPasswordValid]);

  const handleLogin = (e) => { 
    setLogin(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginFocus = () => {
    if (!isLoginFocused) {
      setIsLoginFocused(true);
    }
  };

  const handlePasswordFocus = () => {
    if (!isPasswordFocused) {
      setIsPasswordFocused(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginValid && isPasswordValid) {
      try {
        const response = await fetch("http://172.21.40.127:12038/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login, password }), 
        });
        if (!response.ok) {
          throw new Error("Invalid login data");
        }

        const data = await response.json();

        Cookies.set("username", data.Username);
        updateStatus();
        setLogin(""); 
        setPassword("");
        navigate("/"); // if login was successful, navigate to home page
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <>
      <div className="container-login">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            type="login" 
            value={login}
            handleChange={handleLogin}
            onFocus={handleLoginFocus}
          >
            Login:
          </InputField>
          <LoginValidator
            login={login}
            isLoginFocused={isLoginFocused} 
            setIsLoginValid={setIsLoginValid}
          />
          <InputField
            type="password"
            value={password}
            handleChange={handlePassword}
            onFocus={handlePasswordFocus}
          >
            Password:
          </InputField>
          <PasswordValidator
            password={password}
            isPasswordFocused={isPasswordFocused}
            setIsPasswordValid={setIsPasswordValid}
          />
          <button disabled={!isButtonActive}>Login</button>
        </form>
      </div>
      <div className="container-links">
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <Link to="/">Reset password</Link>
      </div>
    </>
  );
};

export default Login;
