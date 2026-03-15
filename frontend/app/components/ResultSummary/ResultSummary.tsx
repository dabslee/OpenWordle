import React, { useState } from "react";

interface Props {
  results: {
    guess: string;
    result: {
      letter: string;
      state: string;
    }[];
  }[];
}
const ResultSummary: React.FC<Props> = ({ results }) => {
  const getBGColor = (state: string) => {
    if (state === "correct") return "bg-green";
    if (state === "present") return "bg-yellow";
    if (state === "absent") return "bg-secondary";
    else return "bg-primary-reverse";
  };
  return (
    <>
      <div className="col gap-sm">
        {results.map((guess) => {
          return (
            <div className="row gap-sm">
              {guess.result.map((letter) => (
                <div
                  className={`br-md ${getBGColor(letter.state)}`}
                  style={{ height: "36px", width: "36px" }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ResultSummary;
