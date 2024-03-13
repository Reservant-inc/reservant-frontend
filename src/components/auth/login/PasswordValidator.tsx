import React, { useEffect, useState } from "react";

const PasswordValidator = ({
  isPasswordFocused,
  password,
  setIsPasswordValid,
}) => {
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    // checks whether the pasword is empty or if it doesn't match the regex expressions.
    // if so, an appropriate message is displayed
    // message will be displayed only if the user focused on the input element at least once

    // potentially unnecessary in a login component? just leave it in register
    const validate = () => {
      if (isPasswordFocused) {
        if (password.length === 0) {
          setMessage("Password cannot be empty");
          setIsActive(true);
          setIsPasswordValid((e) => false);
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)
        ) {
          setMessage(
            "Incorrect password form - at least 8 characters, including a capital letter and a number"
          );
          setIsActive(true);
          setIsPasswordValid((e) => false);
        } else {
          setMessage("");
          setIsActive(false);
          setIsPasswordValid((e) => true);
        }
      }
    };
    validate();
  }, [password, isPasswordFocused, setIsPasswordValid]);

  return <div>{isActive && message}</div>;
};

export default PasswordValidator;
