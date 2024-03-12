import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import Cookies from "js-cookie";
import './Login.css';

const Login = ({ updateStatus }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setIsEmailEmpty(email.trim() === "");
    setIsPasswordEmpty(password.trim() === "");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailEmpty && !isPasswordEmpty) {
      try {
        const response = await fetch("http://172.21.40.127/auth/login", {
          // ?
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          throw new Error("Invalid login data");
        }
        const data = await response.json();
        if (data.roles.length > 1) {
          navigate("/"); // if the user has more than 1 role, navigate to a page that let's you pick a role
          // albo i nie
        }
        Cookies.set("username", data.Username); // ?
        updateStatus();
        setEmail("");
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
          <InputField type="email" value={email} handleChange={setEmail}>
            Email:
          </InputField>
          {isEmailEmpty && <p>Email cannot be empty!</p>}
          <InputField
            type="password"
            value={password}
            handleChange={setPassword}
          >
            Password:
          </InputField>
          {isPasswordEmpty && <p>Password cannot be empty!</p>}
          <button>Login</button>
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
