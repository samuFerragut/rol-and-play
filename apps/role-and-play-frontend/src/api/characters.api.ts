import { apiClient } from "./api.client";
import type {
  Character,
  CreateCharacterPayload,
} from "../types/character.types";

export async function getCharactersRequest() {
  const { data } = await apiClient.get<Character[]>("/characters");
  return data;
}

export async function createCharacterRequest(payload: CreateCharacterPayload) {
  const { data } = await apiClient.post<Character>("/characters", payload);
  return data;
}

export async function getCharacterByIdRequest(id: string) {
  const { data } = await apiClient.get<Character>(`/characters/${id}`);
  return data;
}
