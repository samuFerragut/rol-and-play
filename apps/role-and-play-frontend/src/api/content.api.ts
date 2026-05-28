import { apiClient } from "./api.client";
import type { Background, CharacterClass, Race } from "../types/content.types";

export async function getRacesRequest() {
  const { data } = await apiClient.get<Race[]>("/content/races");
  return data;
}

export async function getClassesRequest() {
  const { data } = await apiClient.get<CharacterClass[]>("/content/classes");
  return data;
}

export async function getBackgroundsRequest() {
  const { data } = await apiClient.get<Background[]>("/content/backgrounds");
  return data;
}
