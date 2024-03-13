import React from "react";

const InputField = ({ type, value, handleChange, children }) => {
  return (
    <div>
      <label htmlFor={type}>{children}</label>
      <br />
      <input
        type={type}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;
