import React, { use, useEffect, useRef, useState } from "react"
import LetterField from "../LetterField/LetterField"
import "./LetterGroup.css"
import { useIsMobile } from "@/app/utils/isMobile"

interface Props {
  letters: React.ComponentProps<typeof LetterField>[]
  isActive?: boolean
  isLoading?: boolean
  onLetterChange?: (index: number, value: string) => void;
  onSubmitWord?: (word: string) => void
  triggerSuccessAnimation?: boolean;
  triggerShakeAnimation?: boolean;
}

const LetterGroup: React.FC<Props> = ({
  letters,
  isActive,
  isLoading = false,
  onLetterChange,
  onSubmitWord,
  triggerSuccessAnimation = false,
  triggerShakeAnimation
}) => {
  const inputRefs = useRef<HTMLInputElement[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)
  const isMobile = useIsMobile()

  const [values, setValues] = useState<string[]>(
    letters.map((l) => l.value?.toUpperCase() || "")
  )

  // Sync letters prop if it changes
  useEffect(() => {
    setValues(letters.map((l) => l.value?.toUpperCase()  || ""))
  }, [letters])

  useEffect(() => {
    if (triggerShakeAnimation) {
       setShake(true)
      setTimeout(() => setShake(false), 500) // reset after animation
      return
    }
    return
  }, [triggerShakeAnimation])


const handleChange = (index: number, value: string) => {
  onLetterChange?.(index, value);
};

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

  useEffect(() => {
  if (!isActive || isLoading) return;

  const nextIndex = values.findIndex(v => v === "");
  const indexToFocus = nextIndex === -1 ? values.length - 1 : nextIndex;

  setActiveIndex(indexToFocus);
  inputRefs.current[indexToFocus]?.focus();
}, [values, isActive, isLoading]);

  return (
    <div className={`row ${isMobile ? "gap-xs" : "gap-sm"} ${shake ? "shake" : ""}`}>
      {letters.map((letter, index) => (
        <div
        key={`${letter.value}-${letter.state}-${index}`}
          className={success ? "jump" : ""}
          style={success ? { animationDelay: `${index * 0.1}s` } : {}}
        >
          <LetterField
            {...letter}
            variant={letter.variant}
            ref={(el) => {
              if (el) inputRefs.current[index] = el
              if (index === activeIndex && isActive && !isLoading) {
                el?.focus()
              }
            }}
            value={values[index]}
            onChange={(value) => handleChange(index, value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            state={!isActive ? "locked" : "active"}
          />
        </div>
      ))}
    </div>
  )
}

export default LetterGroup
