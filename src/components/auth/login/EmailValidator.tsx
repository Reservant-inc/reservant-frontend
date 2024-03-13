import React, { useEffect, useState } from "react";

const EmailValidator = ({ email, isEmailFocused, setIsEmailValid }) => {
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    // checks whether the email is empty or if it doesn't match the regex expression.
    // if so, an appropriate message is displayed
    // message will be displayed only if the user focused on the input element at least once

    const validate = () => {
      if (isEmailFocused) {
        if (email.length === 0) {
          setMessage("Email cannot be empty");
          setIsActive(true);
          setIsEmailValid((e) => false);
        } else if (
          !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            email
          )
        ) {
          setMessage("Incorrect email form");
          setIsActive(true);
          setIsEmailValid((e) => false);
        } else {
          setMessage("");
          setIsActive(false);
          setIsEmailValid((e) => true);
        }
      }
    };
    validate();
  }, [email, isEmailFocused, setIsEmailValid]);

  return <div>{isActive && message}</div>;
};

export default EmailValidator;
