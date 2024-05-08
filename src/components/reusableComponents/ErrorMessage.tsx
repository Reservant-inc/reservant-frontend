import React from "react";

const ErrorMes = ({msg}:{msg:string}) => {

  return (
    <div className="text-pink">
      {msg}
    </div>
  );
};

export default ErrorMes;
