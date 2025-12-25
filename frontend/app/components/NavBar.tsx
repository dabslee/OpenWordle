import React from 'react'
import NavButton from './NavButton'

interface Props {
    navButtonProps: React.ComponentProps<typeof NavButton>[];
}
const NavBar: React.FC<Props> = ({ 
    navButtonProps
}) => {
  return (
    <div style={{}}>
        {navButtonProps?.map((buttonProps, key) => (
            <NavButton key={String(key)} {...buttonProps}/>
        ))}
    </div>
  )
}

export default NavBar