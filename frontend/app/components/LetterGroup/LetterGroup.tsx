import React, { useEffect, useRef, useState } from "react"
import LetterField from "../LetterField/LetterField"
import "./LetterGroup.css"

interface Props {
  letters: React.ComponentProps<typeof LetterField>[]
  isActive?: boolean
  onSubmitWord?: (word: string) => void
  triggerSuccessAnimation?: boolean;
}

const LetterGroup: React.FC<Props> = ({
  letters,
  isActive,
  onSubmitWord,
  triggerSuccessAnimation = false
}) => {
  const inputRefs = useRef<HTMLInputElement[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)

  const [values, setValues] = useState<string[]>(
    letters.map((l) => l.value || "")
  )

  // Sync letters prop if it changes
  useEffect(() => {
    setValues(letters.map((l) => l.value || ""))
  }, [letters])

  /**
   * 👇 ONLY focus when row becomes active
   */
  useEffect(() => {
    if (isActive) {
      inputRefs.current[0]?.focus()
    }
  }, [isActive])

  const handleChange = (index: number, value: string) => {
    const next = [...values]
    next[index] = value
    setValues(next)

    if (value && index < inputRefs.current.length - 1) {
      const nextIndex = index + 1
      setActiveIndex(nextIndex)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      const prevIndex = index - 1
      setActiveIndex(prevIndex)
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === "Enter") {
      e.preventDefault()

      const word = values.join("")
      if (word.length < letters.length) {
        // Trigger shake animation
        setShake(true)
        setTimeout(() => setShake(false), 500) // reset after animation
        return
      }

      setActiveIndex(0)
      onSubmitWord?.(word)
    }
  }

  useEffect(() => {
    if (triggerSuccessAnimation) {
      // Trigger success animation
      setSuccess(true)
      setTimeout(() => setSuccess(false), 500) // reset after animation
    }
  }, [triggerSuccessAnimation])

  return (
    <div className={`row gap-sm ${shake ? "shake" : ""}`}>
      {letters.map((letter, index) => (
        <div
          className={success ? "jump" : ""}
          style={success ? { animationDelay: `${index * 0.1}s` } : {}}
        >
          <LetterField
            key={index}
            {...letter}
            ref={(el) => {
              if (el) inputRefs.current[index] = el
              if (index === activeIndex && isActive) {
                el?.focus()
              }
            }}
            value={values[index]}
            onChange={(value) => handleChange(index, value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            state={!isActive ? "locked" : "active"}
            // className={success ? "jump" : ""}
            // style={success ? { animationDelay: `${index * 0.1}s` } : {}}
          />
        </div>
      ))}
    </div>
  )
}

export default LetterGroup
