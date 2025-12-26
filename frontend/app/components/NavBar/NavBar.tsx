import React from 'react'
import Button from '../Button/Button';

interface Props {
    navButtonProps: React.ComponentProps<typeof Button>[];
    isLoggedIn?: boolean;
    loginButtonProps?: React.ComponentProps<typeof Button>;
}
const NavBar: React.FC<Props> = ({ 
    navButtonProps,
    isLoggedIn = false,
    loginButtonProps
}) => {
  return (
    <div className={"flex justify-center bg-primary"} style={{width: "100%"}}>
        <div className={"row pad-md pad-y-lg justify-between"} style={{width: "1032px"}}>
            <div className={"row gap-xxl"}>
                {navButtonProps?.map((buttonProps, key) => (
                    <Button key={key} id={String(key)} {...buttonProps} variant={"nav"}/>
                ))}
            </div>
            {!isLoggedIn && <Button variant="primary" {...loginButtonProps}/>}
        </div>
    </div>
  )
}

export default NavBar