import React from 'react'
import Icon from './Icon/Icon';

interface Props {
    children: any;
    className?: string;
    showCopy?: boolean;
    copyProps?: {
      onClick?: () => void
    }
}
const Text: React.FC<Props> = ({ 
    children,
    className = "text-body-b1 text-primary",
    showCopy = false,
    copyProps
}) => {
  return (
    <div className="row gap-sm align-center">
      <div className={className}>
        {children}
      </div>
      {showCopy && <Icon name="copy" size="24px" {...copyProps}/>}
    </div>
  )
}

export default Text