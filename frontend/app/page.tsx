"use client";
import {useState, useEffect} from "react";
import Text from "./components/Text";
import Container from './components/Container/Container';
import LetterGroup from "./components/LetterGroup/LetterGroup";
import { statelessGuess } from "./utils/gameApi";
import { GuessResponse } from "./utils/types";
import { useIsMobile } from "./utils/isMobile";

const TOTAL_GUESSES = 6

export default function HomePage() {
  const isMobile = useIsMobile()
  const [guesses, setGuesses] = useState<string[]>([])
  const [results, setResults] = useState<GuessResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentGuess, setCurrentGuess] = useState<string[]>(Array(TOTAL_GUESSES).fill(""));

  const activeRow = results.length || 0 === 0 ? 0 : (results.length || 0) - 1

  useEffect(() => {
    setCurrentGuess(Array(5).fill(""));
  }, [activeRow])

  const submitGuess = async (guess: string) => {
    try {
      setLoading(true);

      const result = await statelessGuess(guess);

      setCurrentGuess(Array(5).fill(""));
      setGuesses((prev) => [...prev, guess]);
      setResults((prev) => [...prev, result]);
    } catch (err) {
      console.error("ERROR:" ,err);
      setCurrentGuess(Array(5).fill(""));
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
          {results?.map((result) => {
            const guessResult = result
            return (
            <LetterGroup 
              letters={[
                { variant: guessResult.result[0].state, value: guessResult.result[0].letter },
                { variant: guessResult.result[1].state, value: guessResult.result[1].letter },
                { variant: guessResult.result[2].state, value: guessResult.result[2].letter },
                { variant: guessResult.result[3].state, value: guessResult.result[3].letter },
                { variant: guessResult.result[4].state, value: guessResult.result[4].letter },
              ]}
              triggerSuccessAnimation = {guessResult.is_solved}
            />)
          })}
          {emptyGuesses.map((_, index) => {
            const isActiveRow = index === activeRow;
            return(
            <LetterGroup
              key={`empty-${index}`}
              isActive={index === activeRow}
              letters={Array.from({ length: 5 }, (_, i) => ({
                value: isActiveRow ? currentGuess[i] : "",
                variant: "default",
                state: index === activeRow ? "active" : "locked"
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

  return (
      <div className={"flex justify-center bg-blue"} style={{flex: 1, width: "100%"}}>
        <Container >
          <div className="col align-center gap-lg">
            <Text className={'text-headline-h1'}>Wordle</Text>
            <div className="row gap-sm">
                {renderWords(guesses)}
            </div>
          </div>
        </Container>
      </div>
  );
}
