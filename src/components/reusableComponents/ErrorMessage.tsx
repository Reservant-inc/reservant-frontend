import React from "react";

const ErrorMes = ({ msg }: { msg: string }) => {
  return (
    <div id="errorMes-wrap" className="text-error text-ellipsis text-nowrap overflow-hidden text-sm">
      {msg}
    </div>
  );
};

export default ErrorMes;
