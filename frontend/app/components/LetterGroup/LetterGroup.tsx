import React, { useEffect, useRef, useState } from "react"
import LetterField from "../LetterField/LetterField"

interface Props {
    letters: React.ComponentProps<typeof LetterField>[]
    onSubmitWord?: (word: string) => void
}

const LetterGroup: React.FC<Props> = ({ letters, onSubmitWord }) => {
  const inputRefs = useRef<HTMLInputElement[]>([])
    const [values, setValues] = useState<string[]>(
    letters.map((l) => l.value || "")
    )

    // Sync letters prop if it changes
    useEffect(() => {
        setValues(letters.map((l) => l.value || ""))
    }, [letters])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    const next = [...values]
    next[index] = value
    setValues(next)

    // Move forward on input
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move back on delete
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "Enter") {
      const word = values.join("")

      if (word.length < letters.length) {
        console.log("Not enough letters")
        return
      }

      console.log("Submitting:", word)
      onSubmitWord?.(word)
    }
  }
    console.log("LETTERS:", values)

  return (
    <div className="row gap-sm">
      {letters.map((letter, index) => (
        <LetterField
          key={index}
          {...letter}
          ref={(el) => {
            if (el) inputRefs.current[index] = el
          }}
          value={values[index]}
          onChange={(value) => handleChange(index, value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  )
}

export default LetterGroup
