import React from 'react'
import Icon from '../Icon/Icon';
import "./CompactButton.css"

interface Props {
    id?: string;
    icon?: string;
    // variant?: "primary" | "secondary" | "nav"
    state?: "default" | "selected"
    onClick?: () => void;
    showDropShadow?: boolean;
}

const CompactButton: React.FC<Props> = ({ 
    id,
    icon = 'menu',
    state = "default",
    onClick ,
    showDropShadow = true,
}) => {
    
  return (
    <button 
        type="button"
        id={id} 
        onClick={onClick} 
        className="compact-button br-circle border-primary flex align-center justify-center bg-primary"
        >
        <Icon name={icon} size="24px"/>
    </button>
  )
}

export default CompactButton