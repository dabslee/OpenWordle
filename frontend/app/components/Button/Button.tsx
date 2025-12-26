import React from 'react'
import Text from '../Text';
import "./Button.css"

interface Props {
    id?: string;
    size?: "large" | "small"
    variant?: "primary" | "secondary" | "nav"
    text?: string;
    state?: "default" | "selected"
    onClick?: () => void;
    showDropShadow?: boolean;
}

const Button: React.FC<Props> = ({ 
    id,
    size = "small",
    variant = "primary",
    text, 
    state = "default",
    onClick ,
    showDropShadow = true,
}) => {
    const variantConfig = {
        primary: {
            bgColor: "bg-yellow",
            selected: "",
            br: "br-lg",
            pad: "pad-x-md pad-y-sm",
            className: "primary-button"
        },
        secondary: {
            bgColor: "bg-transparent",
            selected: "",
            br: "br-lg",
            pad: "pad-x-md pad-y-sm",
            className: "secondary-button"
        },
        nav: {
            bgColor: "bg-transparent",
            selected: state === "selected" ? "is-selected" : "",
            br: "",
            pad: "",
            className: "nav-button"
        }
    }
    const style = variantConfig[variant]
  return (
    <button 
    type="button"
      id={id} 
      onClick={onClick} 
      className={`${(showDropShadow && variant !== "nav") ? "drop-shadow" : ""} ${style.selected} ${style.bgColor} ${style.br} ${style.pad} ${style.className}`}
      style={{
        height: size === "large" ? "72px" : "",
        width: size === "large" ? "100%" : ""
      }}
      >
      <Text className={"text-headline-h2"}>
        {text}
      </Text>
    </button>
  )
}

export default Button