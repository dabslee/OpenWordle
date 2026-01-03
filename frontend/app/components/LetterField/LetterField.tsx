import React, { forwardRef } from "react"
import "./LetterField.css"
import { useIsMobile } from "@/app/utils/isMobile"

interface Props {
  variant?: "default" | "correct" | "present" | "absent"
  state?: "locked" | "active"
  value?: string
  onChange?: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const LetterField = forwardRef<HTMLInputElement, Props>(
  (
    {
      variant = "default",
      state = "locked",
      value = "",
      onChange,
      onKeyDown,
    },
    ref
  ) => {

    const isMobile = useIsMobile();
    console.log("IS MOBILE?:", isMobile)

    const styling = {
      correct: { bg: "bg-green" },
      present: { bg: "bg-yellow" },
      absent: { bg: "bg-secondary" },
      default: { bg: "bg-transparent" },
    }

    const style = styling[variant]

    return (
      <div
        className={`${style.bg} br-md border-primary  flex align-center justify-center drop-shadow`}
        style={{
          height: isMobile ? "48px" : "72px",
          width: isMobile ? "48px" : "72px",
          boxSizing: "border-box",
        }}
      >
        <input
          ref={ref}
          className={`${isMobile ? "text-headline-h3" : "text-headline-h1"} field-input text-center uppercase`}
          value={value}
          maxLength={1}
          readOnly={state === "locked"}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
    )
  }
)

LetterField.displayName = "LetterField"

export default LetterField
