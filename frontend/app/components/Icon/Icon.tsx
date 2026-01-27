import React, { useEffect, useState } from "react"
import {ALL_ICONS} from "./iconList";
import {COLORS} from "../../styling/colors";

interface Props {
    name: string;
    color?: string;
    size?: '16px' | '24px' | '32px' | '48px';
}

const Icon: React.FC<Props> = ({ name, color, size = '16px' }) => {
  const icon = ALL_ICONS[name]

  if (!icon) {
    console.warn(`Icon not found: ${name}`)
    return null
  }

  return (
    <div
        style={{ width: size, height: size, color: color ? color : COLORS.black }}
        dangerouslySetInnerHTML={{ __html: icon }}
    />
  )
}

export default Icon
