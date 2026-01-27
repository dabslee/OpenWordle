import React from "react"

interface Props {
    className?: string;
    color?: string;
    children?: any;
}

const Icon: React.FC<Props> = ({ className, children }) => {

  return (
    <p className={`text-body-b1 text-primary ${className}`}> {children} </p>
  )
}

export default Icon
