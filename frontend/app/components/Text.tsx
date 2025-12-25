import React from 'react'

interface Props {
    children: any;
    className?: string;
}
const Text: React.FC<Props> = ({ 
    children,
    className = "text-body-b1 text-primary"
}) => {
  return (
    <div className={className}>
       {children}
    </div>
  )
}

export default Text