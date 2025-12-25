// src/api/presetsApi.ts
import { api } from "./api";
import { Preset } from "./types";

export const listPresets = async (): Promise<Preset[]> => {
  const { data } = await api.get<Preset[]>("/api/presets/");
  return data;
};

export const getPreset = async (slug: string): Promise<Preset> => {
  const { data } = await api.get<Preset>(`/api/presets/${slug}/`);
  return data;
};

export const createPreset = async (
  payload: Omit<Preset, "id" | "creator" | "is_pinned">
): Promise<Preset> => {
  const { data } = await api.post<Preset>("/api/presets/", payload);
  return data;
};

export const updatePreset = async (
  slug: string,
  payload: Partial<Preset>
): Promise<Preset> => {
  const { data } = await api.put<Preset>(`/api/presets/${slug}/`, payload);
  return data;
};

export const deletePreset = async (slug: string): Promise<void> => {
  await api.delete(`/api/presets/${slug}/`);
};

export const togglePresetPin = async (
  slug: string
): Promise<{ pinned: boolean }> => {
  const { data } = await api.post<{ pinned: boolean }>(
    `/api/presets/${slug}/toggle_pin/`
  );
  return data;
};
