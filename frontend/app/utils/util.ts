import SnackBar from "../components/SnackBar/SnackBar";
import { useEffect } from "react";

type GuessResult = {
  guess: string;
  result: {
    letter: string;
    state: string;
  }[];
};

export const copyResults = async (
  results: GuessResult[],
  maxAttempts = 6,
  isSolved = true,
) => {
  const getEmoji = (state: string) => {
    if (state === "correct") return "🟩";
    if (state === "present") return "🟨";
    if (state === "absent") return "⬛";
    return "⬜";
  };

  const buildShareText = () => {
    const attempts = isSolved
      ? `${results.length}/${maxAttempts}`
      : `X/${maxAttempts}`;

    const grid = results
      .map(guess =>
        guess.result.map(letter => getEmoji(letter.state)).join("")
      )
      .join("\n");

    return `My Wordle ${attempts}\n\n${grid}`;
  };

  const text = buildShareText();

  const isMobileOS =
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    // 📱 iOS / Android only → native share sheet
    if (isMobileOS && navigator.share) {
      await navigator.share({
        title: "My Wordle Results",
        text,
      });
      return;
    }

    // 💻 everything else → clipboard
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Copy/share failed", err);
  }
};

// PREVENT SCROLL ON MOBILE

export function usePreventScrollMobile() {
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (!isMobile) return;

    // Stop normal scroll
    document.body.style.overflow = "hidden";

    // Prevent touch scrolling (for iOS)
    const preventTouch = (e: TouchEvent) => e.preventDefault();
    document.body.addEventListener("touchmove", preventTouch, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.body.removeEventListener("touchmove", preventTouch);
    };
  }, []);
}
