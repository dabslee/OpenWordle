import React, { useEffect, useState } from "react"
import {ALL_ICONS} from "./iconList";
import {COLORS} from "../../styling/colors";
import "./Icon.css"

interface Props {
    name: string;
    color?: string;
    size?: '16px' | '24px' | '32px' | '48px';
    onClick?: any;
}

const Icon: React.FC<Props> = ({ name, color, size = '16px', onClick }) => {
  const icon = ALL_ICONS[name]

  if (!icon) {
    console.warn(`Icon not found: ${name}`)
    return null
  }

  return (
    <div className={"clickable-icon"} style={{  cursor: onClick ? "pointer" : "default", display: "inline-flex", width: size, height: size,}} onClick={onClick}>
      <div
        style={{ color: color ? color : COLORS.black, pointerEvents: "none"}}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    </div>
  )
}

export default Icon
