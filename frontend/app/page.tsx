"use client";
import React, {useState, useEffect} from "react";
import Text from "./components/Text";
import Container from './components/Container/Container';
import LetterField from "./components/LetterField/LetterField";
import LetterGroup from "./components/LetterGroup/LetterGroup";

const TOTAL_GUESSES = 5

const renderWords = (guesses?: string[], setGuesses) => {
    const emptyGuesses = Array.from(
      { length: TOTAL_GUESSES - (guesses?.length || 0) },
      () => ""
    )
    // const activeGuess = (guesses?.length || 0)
    const [activeRow, setActiveRow] = useState((guesses?.length || 0))
    return (
      <>
        <div className="col gap-sm">
          {guesses?.map((guess) => {
            console.log("GUESS: ", guess?.[0])
            return (
            <LetterGroup 
              letters={[
                { variant: "contained", value: guess?.[0] },
                { variant: "correct", value: guess?.[1] },
                { variant: "correct", value: guess?.[2] },
                { variant: "filled", value: guess?.[3] },
                { variant: "correct", value: guess?.[4] },
              ]}
            />)
})}
          {emptyGuesses.map((_, index) => (
            <LetterGroup
              key={`empty-${index}`}
              letters={Array.from({ length: 5 }, () => ({
                variant: "default",
                state: activeRow === index ? "active" : "locked"
              }))}
              onSubmitWord={(word) => {
                setGuesses((prev) => [...prev, word])
              }}
            />
          ))}
        </div>
      </>
    )
}

export default function HomePage() {
  const [guesses, setGuesses] = useState<string[]>([])
  useEffect(() => {
    console.log("Guesses: ", guesses)
  }, [guesses])
  return (
      <div className={"flex justify-center bg-blue"} style={{flex: 1, width: "100%"}}>
        <Container>
          <Text className={'text-headline-h1'}>Wordle</Text>
          <div className="row gap-sm">
            {renderWords(guesses, setGuesses)}
          </div>
        </Container>
      </div>
  );
}
