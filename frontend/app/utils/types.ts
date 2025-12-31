export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  status: "success";
  user: User;
  token: string;
}

export interface Preset {
  id: number;
  title: string;
  description: string;
  letter_count: number;
  max_guesses: number;
  slug: string;
  creator: {
    id: number;
    username: string;
  };
  is_pinned: boolean;
}

export type LetterState = "correct" | "present" | "absent";

export interface LetterResult {
  letter: string;
  state: LetterState;
}

export interface GameState {
  preset: Preset;
  guesses: string[];
  remaining_guesses: number;
  is_solved: boolean;
  is_failed: boolean;
  status: "playing" | "solved" | "failed";
  results: LetterResult[][];
}

export interface GuessResponse {
  guess: string;
  result: LetterResult[];      // length 5
  is_solved: boolean;
  is_failed: boolean;
  remaining_guesses: number | null;
}
