import React from 'react'

interface Props {
    key?: string;
    text?: string;
    onClick?: () => void;
}

const NavButton: React.FC<Props> = ({ 
    key,
    text, 
    onClick 
}) => {
  return (
    <button id={key} onClick={onClick}>
        {text}
    </button>
  )
}

export default NavButton