import React from "react";

const InputField = ({ type, value, handleChange, onFocus, children }) => {
  return (
    <div>
      <label htmlFor={type}>{children}</label>
      <br />
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
      />
    </div>
  );
};

export default InputField;
