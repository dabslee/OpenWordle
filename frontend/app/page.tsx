"use client";
import { useState, useEffect } from "react";
import Text from "./components/Text";
import Container from "./components/Container/Container";
import LetterGroup from "./components/LetterGroup/LetterGroup";
import { statelessGuess } from "./utils/gameApi";
import { GuessResponse } from "./utils/types";
import { useIsMobile, useIsPhone } from "./utils/isMobile";
import SnackBar from "./components/SnackBar/SnackBar";
import Keyboard from "./components/Keyboard/Keyboard";
import Cookies from "js-cookie";
import Modal from "./components/Modal/Modal";
import ResultSummary from "./components/ResultSummary/ResultSummary";
import Button from "./components/Button/Button";
import { copyResults } from "./utils/util";
import Confetti from "./components/Confetti/Confetti";
import PageHeader from "./components/PageHeader/PageHeader";
import { COLORS } from "./styling/colors";

const TOTAL_GUESSES = 6;

const COOKIE_EXPIRY_DAYS = 1; // 24 hours

const handleClear = () => {
  Cookies.remove("wordle_guesses");
  Cookies.remove("wordle_results");
  Cookies.remove("wordle_currentGuess");
  Cookies.remove("wordle_gameState");
  window.location.reload(); // optional: reload to reset state
};

export default function HomePage() {
  const isMobile = useIsMobile();
  const isPhone = useIsPhone();

  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [triggerShake, setTriggerShake] = useState(false);
  // Initialize with defaults first
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<GuessResponse[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>(Array(5).fill(""));
  const [gameState, setGameState] = useState({
    isSolved: false,
    isFailed: false,
  });
  const [open, setOpen] = useState(false); // open state for success modal

  const [hydrated, setHydrated] = useState(false);

  // After mount, read cookies and update state
  useEffect(() => {
    const guessesCookie = Cookies.get("wordle_guesses");
    if (guessesCookie) setGuesses(JSON.parse(guessesCookie));

    const resultsCookie = Cookies.get("wordle_results");
    if (resultsCookie) setResults(JSON.parse(resultsCookie));

    const currentGuessCookie = Cookies.get("wordle_currentGuess");
    if (currentGuessCookie) setCurrentGuess(JSON.parse(currentGuessCookie));

    const currentGameState = Cookies.get("wordle_gameState");
    if (currentGameState) setGameState(JSON.parse(currentGameState));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    Cookies.set("wordle_guesses", JSON.stringify(guesses), {
      expires: COOKIE_EXPIRY_DAYS,
    });
    console.log("GUESSES COOKIES SET: ", guesses);
  }, [guesses]);

  useEffect(() => {
    if (!hydrated) return;
    Cookies.set("wordle_results", JSON.stringify(results), {
      expires: COOKIE_EXPIRY_DAYS,
    });
    console.log("RESULTS COOKIES SET: ", results);
  }, [results]);

  useEffect(() => {
    if (!hydrated) return;
    Cookies.set("wordle_currentGuess", JSON.stringify(currentGuess), {
      expires: COOKIE_EXPIRY_DAYS,
    });
    console.log("CURRENTGUESS COOKIES SET: ", currentGuess);
  }, [currentGuess]);

  useEffect(() => {
    if (!hydrated) return;
    Cookies.set("wordle_gameState", JSON.stringify(gameState), {
      expires: COOKIE_EXPIRY_DAYS,
    });
    if (gameState.isSolved || results.length === 6) {
      setOpen(true);
    } // open modal when game over
    console.log("GAME STATE COOKIES SET: ", gameState);
  }, [gameState]);

  useEffect(() => {
    setCurrentGuess(Array(5).fill(""));
  }, [results.length]);

  const submitGuess = async (guess: string) => {
    try {
      setLoading(true);

      const result = await statelessGuess(guess);

      setCurrentGuess(Array(5).fill(""));
      setGuesses((prev) => [...prev, guess]);
      setResults((prev) => [...prev, result]);
      setGameState({ isSolved: result.is_solved, isFailed: result.is_failed });
    } catch (err) {
      console.error("ERROR:", err);
      setError(err);
      setTriggerShake(true);
      setSnackbarKey((prev) => prev + 1);

      setTimeout(() => {
        setTriggerShake(false);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const renderWords = (guesses?: string[]) => {
    const emptyGuesses = Array.from(
      { length: TOTAL_GUESSES - (guesses?.length || 0) },
      () => "",
    );
    return (
      <>
        <div className={`col ${isMobile ? "gap-xs" : "gap-sm"}`}>
          {results?.map((result, index, key) => {
            const guessResult = result;
            return (
              <LetterGroup
                key={`result-${index}`}
                letters={[
                  {
                    variant: guessResult.result[0].state ?? "correct",
                    value: guessResult.result[0].letter,
                  },
                  {
                    variant: guessResult.result[1].state ?? "correct",
                    value: guessResult.result[1].letter,
                  },
                  {
                    variant: guessResult.result[2].state ?? "correct",
                    value: guessResult.result[2].letter,
                  },
                  {
                    variant: guessResult.result[3].state ?? "correct",
                    value: guessResult.result[3].letter,
                  },
                  {
                    variant: guessResult.result[4].state ?? "correct",
                    value: guessResult.result[4].letter,
                  },
                ]}
                triggerSuccessAnimation={guessResult.is_solved}
              />
            );
          })}
          {emptyGuesses.map((_, index) => {
            const isActiveRow =
              gameState.isSolved || gameState.isFailed ? false : index === 0;
            return (
              <LetterGroup
                key={`empty-${index}`}
                isActive={isActiveRow}
                triggerShakeAnimation={isActiveRow && triggerShake}
                letters={Array.from({ length: 5 }, (_, i) => ({
                  value: isActiveRow ? currentGuess[i] : "",
                  variant: "default",
                  state: isActiveRow ? "active" : "locked",
                }))}
                onLetterChange={(i, val) => {
                  if (!isActiveRow) return;
                  const next = [...currentGuess];
                  next[i] = val;
                  setCurrentGuess(next);
                }}
                onSubmitWord={submitGuess}
                isLoading={loading}
              />
            );
          })}
        </div>
      </>
    );
  };

  const handleInput = (key: string) => {
    if (loading) return;

    // submit
    if (key === "ENTER") {
      const guess = currentGuess.join("");
      if (guess.length === 5) {
        submitGuess(guess);
      }
      if (guess.length < 5) {
        setTriggerShake(true);
        setTimeout(() => {
          setTriggerShake(false);
        }, 500);
      }
      return;
    }

    // delete
    if (key === "BACKSPACE") {
      setCurrentGuess((prev) => {
        const next = [...prev];
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i]) {
            next[i] = "";
            break;
          }
        }
        return next;
      });
      return;
    }

    // letters
    if (/^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) => {
        const next = [...prev];
        const index = next.findIndex((l) => l === "");
        if (index !== -1) next[index] = key;
        return next;
      });
    }
  };
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      handleInput(e.key.toUpperCase());
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentGuess, loading]);

  const getKeyboardStates = () => {
    const letterStates: Record<string, "absent" | "present" | "correct"> = {};

    results.forEach((resObj) => {
      resObj.result.forEach(
        ({
          letter,
          state,
        }: {
          letter: string;
          state: "correct" | "present" | "absent";
        }) => {
          letterStates[letter.toUpperCase()] = state;
        },
      );
    });

    return letterStates;
  };
  return (
    <div
      className={`flex justify-center bg-light-orange ${isMobile ? "pad-t-xxl" : "pad-t-xxxl"}`}
      style={{
        position: "absolute",
        flex: 1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Container>
        <div className="col align-center gap-lg">
          {/* <Text className={"text-headline-h1"}>WORDLE</Text> */}
          <PageHeader
            title="WORDLE"
            variant="icon"
            iconProps={{ name: "squares", color: COLORS.white }}
          />
          <div className="row gap-sm bg-lavender pad-lg br-xl border-primary drop-shadow-md">
            {renderWords(guesses)}
          </div>
          {error?.response?.data?.error && (
            <SnackBar key={snackbarKey} message={error.response.data.error} />
          )}
          {open && (
            <>
              <Modal
                open={open}
                variant={gameState.isSolved ? "success" : "error"}
                onClose={() => setOpen(false)}
                header="share your results"
              >
                <div
                  className="col align-center justify-between gap-lg"
                  style={{ width: "100%" }}
                >
                  <ResultSummary results={results} />
                  <div style={{ width: "100%" }}>
                    <Button
                      variant="primary"
                      showDropShadow
                      text={"COPY RESULTS"}
                      onClick={() =>
                        copyResults(results, 6, gameState.isSolved)
                      }
                      size="large"
                      iconName="copy"
                    />
                  </div>
                </div>
              </Modal>
              {gameState.isSolved && <Confetti />}
            </>
          )}
          <div
            style={{
              position: isPhone ? "absolute" : undefined,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Keyboard
              letterStates={getKeyboardStates()}
              onKeyPress={handleInput}
            />
          </div>

          {/* REMOVE AFTER DEV */}
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Wordle Cookies
          </button>
          {/* REMOVE AFTER DEV */}
        </div>
      </Container>
    </div>
  );
}
