import React, { useEffect, useState } from "react";

const LoginValidator = ({ login, isLoginFocused, setIsLoginValid }) => {
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // we are checking only if login is not empty
    const validate = () => {
      if (isLoginFocused) {
        if (login.length === 0) {
          setMessage("Login cannot be empty");
          setIsActive(true);
          setIsLoginValid(false);
        } else {
          setMessage("");
          setIsActive(false);
          setIsLoginValid(true);
        }
      }
    };
    validate();
  }, [login, isLoginFocused, setIsLoginValid]);

  return <div>{isActive && message}</div>;
};

export default LoginValidator;
