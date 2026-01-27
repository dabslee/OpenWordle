import React from "react"
import LetterField from "../LetterField/LetterField"
import "./Keyboard.css"
import { useIsMobile } from "@/app/utils/isMobile"
import Button from "../Button/Button"

type KeyboardMap = Record<string, "default" | "correct" | "present" | "absent">

interface Props {
  letterStates?: KeyboardMap
  onKeyPress?: (key: string) => void
}

const KEYBOARD_ROWS = [
  ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
  ["J", "K", "L", "M", "N", "O", "P", "Q", "R"],
  ["S", "T", "U", "V", "W", "X", "Y", "Z", "<"],
  ["ENTER"]
]

const Keyboard: React.FC<Props> = ({ letterStates, onKeyPress }) => {
    const isMobile = useIsMobile()

  return (
    <div className={`col border-primary br-lg ${isMobile ? 'pad-sm gap-xs' : 'pad-lg gap-xs'} bg-primary`}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className={`row align-center justify-center ${isMobile ? 'gap-xs' : 'gap-xs'}`}>
          {row.map((letter) => {
            const isEnter = letter === "ENTER"
            return (
              <>
              {isEnter ? 
              <></>
              // <Button text={letter} variant="secondary"/>
               : <LetterField
              key={letter}
              value={letter}
              variant={letterStates?.[letter] ?? "default"}
              state="button"
              size={isMobile ? "small" : "large"}
              onClick={() => {
                if (!onKeyPress) return;

                if (letter === "<") {
                  onKeyPress("BACKSPACE");
                } else {
                  onKeyPress(letter);
                }
              }}
            />}
              </>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Keyboard
