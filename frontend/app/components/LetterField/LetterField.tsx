import React, { forwardRef, useEffect, useState } from "react"
import "./LetterField.css"
import { useIsMobile } from "@/app/utils/isMobile"

interface Props {
  variant?: "default" | "correct" | "present" | "absent"
  state?: "locked" | "active" | "button"
  size?: "large" | "small"
  value?: string
  onChange?: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: () => void;
}

const LetterField = forwardRef<HTMLInputElement, Props>(
  (
    {
      variant = "default",
      state = "locked",
      size = "large",
      value = "",
      onChange,
      onKeyDown,
      onClick
    },
    ref
  ) => {
 
    return (
      <div
      key={variant + "_" + value}
        className={`${variant} br-md border-primary  flex align-center justify-center`}
        style={{
          height: size === "large" ? "48px" : "34px",
          width: size === "large" ? "48px" : "34px",
          boxSizing: "border-box",
        }}
        onClick={onClick}
      >
        <input
          ref={ref}
          className={`${size === "large" ? 'text-headline-h2' : 'text-headline-h4'} letter-field-input text-center uppercase ${state === "button" && "button-cursor"} ${state === "locked" && "locked-cursor"}`}
          value={value}
          maxLength={1}
          readOnly={state === "locked" || state === "button"}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
    )
  }
)

LetterField.displayName = "LetterField"

export default LetterField
