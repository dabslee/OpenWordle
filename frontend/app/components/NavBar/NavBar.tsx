import React, {useState} from 'react'
import Button from '../Button/Button';
import { useApp } from '@/app/utils/AppContext';
import { useIsMobile } from '@/app/utils/isMobile';
import CompactButton from '../CompactButton/CompactButton';
import SheetDrawer from '../SheetDrawer/SheetDrawer';

interface Props {
    navButtonProps: React.ComponentProps<typeof Button>[];
    // isLoggedIn?: boolean;
    loginButtonProps?: React.ComponentProps<typeof Button>;
}
const NavBar: React.FC<Props> = ({ 
    navButtonProps,
    // isLoggedIn = false,
    loginButtonProps
}) => {
    const { isLoggedIn } = useApp();
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);

    const handleCompactClick = () => {
        setIsOpen((prev) => !prev)
    }

    const handleOutsideClick = () => {
        setIsOpen(false)
    }

  return (
    <>
    {isMobile ? 
    <div className="flex justify-end pad-sm">
        <CompactButton onClick={handleCompactClick} />
        <SheetDrawer open={isOpen} onClose={handleOutsideClick}>
            <div className="col align-start gap-lg">
            {navButtonProps?.map((buttonProps, key) => (
                <Button key={key} id={String(key)} {...buttonProps} variant={"nav"}/>
            ))}
             {!isLoggedIn && <Button variant="nav" {...loginButtonProps}/>}
            </div>
        </SheetDrawer>
    </div>
    :
    <div className={"flex justify-center br-lg mrg-t-lg"} style={{width: "100%"}}>
        <div className="flex justify-center bg-primary br-xl mrg-x-lg border-primary" style={{width: "100%"}}>
            <div className={"row pad-md pad-y-md justify-between"} style={{width: "1032px"}}>
                <div className={"row align-center gap-xxl"}>
                    {navButtonProps?.map((buttonProps, key) => (
                        <Button key={key} id={String(key)} {...buttonProps} variant={"nav"}/>
                    ))}
                </div>
                {!isLoggedIn && <Button variant="primary" {...loginButtonProps}/>}
            </div>
        </div>
    </div>
    }
    </>
  )
}

export default NavBar