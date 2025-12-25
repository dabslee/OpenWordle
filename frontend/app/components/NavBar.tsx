import React from 'react'
import NavButton from './NavButton'

interface Props {
    navButtonProps: React.ComponentProps<typeof NavButton>[];
}
const NavBar: React.FC<Props> = ({ 
    navButtonProps
}) => {
  return (
    <div className={"flex justify-center bg-secondary"} style={{width: "100%"}}>
        <div className={"row pad-md gap-lg"} style={{width: "1032px"}}>
            {navButtonProps?.map((buttonProps, key) => (
                <NavButton key={key} id={String(key)} {...buttonProps}/>
            ))}
        </div>
    </div>
  )
}

export default NavBar