import React from 'react'

const ErrorMes = ({ msg }: { msg: string }) => {
  return (
    <div id="errorMes-wrap">
      <p className="text-error truncate text-nowrap overflow-hidden text-sm">
        {msg}
      </p>
    </div>
  )
}

export default ErrorMes
