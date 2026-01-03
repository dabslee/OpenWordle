// src/api/gameApi.ts
import { api } from "./api";
import { GameState, LetterResult, GuessResponse, Preset } from "./types";

export const getGameState = async (
  presetSlug?: string
): Promise<GameState> => {
  const { data } = await api.get<GameState>("/api/game/", {
    params: presetSlug ? { preset: presetSlug } : undefined,
  });
  return data;
};

export const submitGuess = async (
  guess: string,
  preset?: string
): Promise<{
  guess: string;
  result: LetterResult[];
  is_solved: boolean;
  is_failed: boolean;
  remaining_guesses: number | null;
}> => {
  const { data } = await api.post("/api/game/", {
    guess,
    ...(preset && { preset }),
  });

  return data;
};

export const statelessGuess = async (
  guess: string,
  preset?: Preset,
): Promise<GuessResponse> => {
  const { data } = await api.post<GuessResponse>("/api/game/guess/", {
    guess,
    preset,
  });

  return data;
};

export const getRefreshStatus = async (): Promise<{
  seconds_until_refresh: number;
  next_refresh_at: string;
}> => {
  const { data } = await api.get("/api/game/refresh/");
  return data;
};
