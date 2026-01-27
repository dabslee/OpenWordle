"use client";
import {useState, useEffect} from "react";
import Text from "./components/Text";
import Container from './components/Container/Container';
import LetterGroup from "./components/LetterGroup/LetterGroup";
import { statelessGuess } from "./utils/gameApi";
import { GuessResponse } from "./utils/types";
import { useIsMobile } from "./utils/isMobile";
import SnackBar from "./components/SnackBar/SnackBar";
import Keyboard from "./components/Keyboard/Keyboard";
import Cookies from 'js-cookie';

const TOTAL_GUESSES = 6

const COOKIE_EXPIRY_DAYS = 1; // 24 hours

const handleClear = () => {
    Cookies.remove("wordle_guesses");
    Cookies.remove("wordle_results");
    Cookies.remove("wordle_currentGuess");
    window.location.reload(); // optional: reload to reset state
  };

export default function HomePage() {
  const isMobile = useIsMobile()

  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0)
  const [triggerShake, setTriggerShake] = useState(false);
    // Initialize with defaults first
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<GuessResponse[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>(Array(5).fill(""));
  const [gameState, setGameState] = useState({isSolved: false, isFailed: false})

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
  }, []);

  useEffect(() => {
    Cookies.set("wordle_guesses", JSON.stringify(guesses), { expires: COOKIE_EXPIRY_DAYS });
  }, [guesses]);

  useEffect(() => {
    Cookies.set("wordle_results", JSON.stringify(results), { expires: COOKIE_EXPIRY_DAYS });
  }, [results]);

  useEffect(() => {
    Cookies.set("wordle_currentGuess", JSON.stringify(currentGuess), { expires: COOKIE_EXPIRY_DAYS });
  }, [currentGuess]);

  useEffect(() => {
    Cookies.set("wordle_gameState", JSON.stringify(gameState), { expires: COOKIE_EXPIRY_DAYS });
  }, [gameState]);
  
  useEffect(() => {
    setCurrentGuess(Array(5).fill(""));
  }, [results.length])

  const submitGuess = async (guess: string) => {
    try {
      setLoading(true);

      const result = await statelessGuess(guess);

      setCurrentGuess(Array(5).fill(""));
      setGuesses((prev) => [...prev, guess]);
      setResults((prev) => [...prev, result]);
      setGameState({isSolved: result.is_solved, isFailed: result.is_failed})

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
      () => ""
    )
    return (
      <>
        <div className={`col ${isMobile ? "gap-xs" : "gap-sm"}`}>
          {results?.map((result, index, key) => {
            const guessResult = result
            return (
            <LetterGroup 
              key={`result-${index}`}
              letters={[
                { variant: guessResult.result[0].state ?? "correct", value: guessResult.result[0].letter },
                { variant: guessResult.result[1].state ?? "correct", value: guessResult.result[1].letter },
                { variant: guessResult.result[2].state ?? "correct", value: guessResult.result[2].letter },
                { variant: guessResult.result[3].state ?? "correct", value: guessResult.result[3].letter },
                { variant: guessResult.result[4].state ?? "correct", value: guessResult.result[4].letter },
              ]}
              triggerSuccessAnimation = {guessResult.is_solved}
            />)
          })}
          {emptyGuesses.map((_, index) => {
            const isActiveRow = (gameState.isSolved || gameState.isFailed) ? false : index === 0;
            return(
            <LetterGroup
              key={`empty-${index}`}
              isActive={isActiveRow}
              triggerShakeAnimation={isActiveRow && triggerShake}
              letters={Array.from({ length: 5 }, (_, i) => ({
                value: isActiveRow ? currentGuess[i] : "",
                variant: "default",
                state: isActiveRow ? "active" : "locked"
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
            )})}
        </div>
      </>
    )
}

const handleInput = (key: string) => {
  if (loading) return;

  // submit
  if (key === "ENTER") {
    const guess = currentGuess.join("");
    if (guess.length === 5) {
      submitGuess(guess);
    }
    return;
  }

  // delete
  if (key === "BACKSPACE") {
    setCurrentGuess(prev => {
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
    setCurrentGuess(prev => {
      const next = [...prev];
      const index = next.findIndex(l => l === "");
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
  const letterStates: Record<string, "absent" | "present" | "correct"> = {}

  results.forEach(resObj => {
    resObj.result.forEach(({ letter, state }:{letter: string, state: "correct" | "present" | "absent"}) => {
      letterStates[letter.toUpperCase()] = state
    })
  })

  return letterStates
}

  return (
      <div className={`flex justify-center bg-blue ${isMobile ? "pad-t-xxl" : "pad-t-xxxl"}`} style={{flex: 1, width: "100%"}}>
        <Container >
          <div className="col align-center gap-lg">
            <Text className={'text-headline-h1'}>WORDLE</Text>
            <div className="row gap-sm">
                {renderWords(guesses)}
            </div>
            {error?.response?.data?.error && (
              <SnackBar
                key={snackbarKey}
                message={error.response.data.error}
              />
            )}
            <div style={{position: isMobile ? 'absolute' : undefined, bottom: 24}}>
              <Keyboard letterStates={getKeyboardStates()}  onKeyPress={handleInput}/>
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
