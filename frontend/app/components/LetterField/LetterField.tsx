import React, { forwardRef } from "react"
import "./LetterField.css"

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
    const styling = {
      correct: { bg: "bg-green" },
      present: { bg: "bg-yellow" },
      absent: { bg: "bg-secondary" },
      default: { bg: "bg-transparent" },
    }

    const style = styling[variant]

    return (
      <div
        className={`${style.bg} br-md border-primary pad-md flex align-center justify-center drop-shadow`}
        style={{
          height: "72px",
          width: "72px",
          boxSizing: "border-box",
        }}
      >
        <input
          ref={ref}
          className="text-headline-h1 field-input text-center uppercase"
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
