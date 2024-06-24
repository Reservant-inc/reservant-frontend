import React from "react";

const ErrorMes = ({ msg }: { msg: string }) => {
  return <div id="errorMes-wrap" className="text-pink">{msg}</div>;
};

export default ErrorMes;
