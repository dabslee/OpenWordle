"use client";
import React, {useState, useEffect} from "react";
import Text from "./components/Text";
import Container from './components/Container/Container';
import LetterGroup from "./components/LetterGroup/LetterGroup";
import { statelessGuess } from "./utils/gameApi";
import { GuessResponse } from "./utils/types";
import { Preset } from "./utils/types";

const TOTAL_GUESSES = 6

export default function HomePage() {
  const [guesses, setGuesses] = useState<string[]>([])
  const [results, setResults] = useState<GuessResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitGuess = async (guess: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await statelessGuess(guess);

      setGuesses((prev) => [...prev, guess]);
      setResults((prev) => [...prev, result]);
    } catch (err) {
      console.error(err);
      setError("Failed to submit guess");
    } finally {
      setLoading(false);
    }
  };

  const renderWords = (guesses?: string[]) => {
    const emptyGuesses = Array.from(
      { length: TOTAL_GUESSES - (guesses?.length || 0) },
      () => ""
    )
    // const activeGuess = (guesses?.length || 0)
    const [activeRow, setActiveRow] = useState((guesses?.length || 0))
    return (
      <>
        <div className="col gap-sm">
          {guesses?.map((guess, index) => {
            return (
            <LetterGroup 
              letters={[
                { variant: results[index]?.result[0].state, value: guess?.[0] },
                { variant: results[index]?.result[1].state, value: guess?.[1] },
                { variant: results[index]?.result[2].state, value: guess?.[2] },
                { variant: results[index]?.result[3].state, value: guess?.[3] },
                { variant: results[index]?.result[4].state, value: guess?.[4] },
              ]}
              triggerSuccessAnimation = {results[index]?.is_solved}
            />)
          })}
          {emptyGuesses.map((_, index) => (
            <LetterGroup
              key={`empty-${index}`}
              isActive={index === activeRow}
              letters={Array.from({ length: 5 }, () => ({
                variant: "default",
                state: index === activeRow ? "active" : "locked"
              }))}
              onSubmitWord={submitGuess}
            />
          ))}
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
                {renderWords(guesses, setGuesses)}
            </div>
          </div>
        </Container>
      </div>
  );
}
