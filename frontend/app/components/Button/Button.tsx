import React from 'react'
import Text from '../Text';
import "./Button.css"
import { COLORS } from '@/app/styling/colors';

interface Props {
    id?: string;
    size?: "large" | "small"
    variant?: "primary" | "secondary" | "nav" | "link"
    text?: string;
    state?: "default" | "selected"
    onClick?: () => void;
    showDropShadow?: boolean;
}

type Variant = {
  bgColor?: string;
  br?: string;
  pad?: string;
  className?: string;
  style?: React.CSSProperties;
  textColor?: string;
  selected?: string;
  showDropShadow?: boolean;
};

const Button: React.FC<Props> = ({ 
    id,
    size = "small",
    variant = "primary",
    text, 
    state = "default",
    onClick ,
    showDropShadow = true,
}) => {
    const isLarge = size === "large" 
    const variantConfig: Record<string, Variant> = {
        primary: {
            bgColor: "bg-yellow",
            br: "br-xxl",
            pad: isLarge ? "pad-x-md pad-y-sm" : "pad-x-md pad-y-xs",
            className: "primary-button border-primary",
            style: {
              height: isLarge ? "64px" : "48px",
              width: isLarge ? "100%" : ""
            },
            showDropShadow: showDropShadow,
        },
        secondary: {
            bgColor: "bg-transparent",
            selected: "",
            br: "br-xxl",
            pad: "pad-x-md pad-y-sm",
            className: "secondary-button border-primary",
            style: {
              height: isLarge ? "64px" : "48px",
              width: isLarge ? "100%" : ""
            },
            showDropShadow: showDropShadow,
        },
        nav: {
            bgColor: "bg-transparent",
            selected: state === "selected" ? "is-selected" : "",
            className: "nav-button",
            style: { height: 'fit-content', width: size === "large" ? "100%" : "" },
            showDropShadow: false,
        },
        link: {
            bgColor: "bg-transparent",
            textColor: "text-blue",
            className: "link-button",
            style: { height: 'fit-content', width: size === "large" ? "100%" : "", textDecoration: "underline", textDecorationColor: COLORS.blue},
            showDropShadow: false,
        },
        default: {
            textColor: "text-primary",
            selected: "",
            br: "",
            pad: "",
        }
    }
    const style = variantConfig[variant]
  return (
    <button 
    type="button"
      id={id} 
      onClick={onClick} 
      className={`${(style.showDropShadow) ? "drop-shadow" : ""} ${style.selected} ${style.bgColor} ${style.br} ${style.pad} ${style.className}`}
      style={style.style}
      >
      <Text className={`text-headline-h3 ${style.textColor}`}>
        {text}
      </Text>
    </button>
  )
}

export default Button