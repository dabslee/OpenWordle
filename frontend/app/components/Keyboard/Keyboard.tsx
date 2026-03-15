import React from "react";
import LetterField from "../LetterField/LetterField";
import "./Keyboard.css";
import { useIsPhone } from "@/app/utils/isMobile";
import Button from "../Button/Button";

type KeyboardMap = Record<string, "default" | "correct" | "present" | "absent">;

interface Props {
  letterStates?: KeyboardMap;
  type?: "abc" | "qwerty";
  onKeyPress?: (key: string) => void;
}

const KEYBOARD_ROWS_ABC = [
  ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
  ["J", "K", "L", "M", "N", "O", "P", "Q", "R"],
  ["S", "T", "U", "V", "W", "X", "Y", "Z", "<", "✓"],
];

export const KEYBOARD_ROWS_QWERTY = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "<", "✓"],
];

const Keyboard: React.FC<Props> = ({
  letterStates,
  onKeyPress,
  type = "qwerty",
}) => {
  const isPhone = useIsPhone();
  const keyboard = type === "qwerty" ? KEYBOARD_ROWS_QWERTY : KEYBOARD_ROWS_ABC;

  return (
    <div
      className={`col border-primary ${isPhone ? "pad-sm pad-y-md gap-xxs br-t-lg" : "pad-lg gap-xs br-lg drop-shadow-md"} bg-dusty-blue`}
    >
      {keyboard.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`row align-center justify-center ${isPhone ? "gap-xxs" : "gap-xs"}`}
        >
          {row.map((letter, index) => {
            return (
              <LetterField
                key={letter + "_" + index}
                value={letter}
                variant={letterStates?.[letter] ?? "default"}
                state="button"
                size={isPhone ? "small" : "large"}
                onClick={() => {
                  if (!onKeyPress) return;

                  if (letter === "<") {
                    onKeyPress("BACKSPACE");
                  } else if (letter === "✓") {
                    onKeyPress("ENTER");
                  } else {
                    onKeyPress(letter);
                  }
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
