import React from 'react'
import Text from './Text';

interface Props {
    id?: string;
    text?: string;
    onClick?: () => void;
}

const NavButton: React.FC<Props> = ({ 
    id,
    text, 
    onClick 
}) => {
  return (
    <button id={id} onClick={onClick}>
      <Text>
        {text}
      </Text>
    </button>
  )
}

export default NavButton