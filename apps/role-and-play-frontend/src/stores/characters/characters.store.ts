import { defineStore } from "pinia";

import {
  createCharacterRequest,
  getCharacterByIdRequest,
  getCharactersRequest,
} from "../../api/characters.api";

import type {
  Character,
  CreateCharacterPayload,
} from "../../types/character.types";

interface CharactersState {
  characters: Character[];

  selectedCharacter: Character | null;

  isLoading: boolean;
}

export const useCharactersStore = defineStore("characters", {
  state: (): CharactersState => ({
    characters: [],

    selectedCharacter: null,

    isLoading: false,
  }),

  actions: {
    async fetchCharacters() {
      this.isLoading = true;

      try {
        const characters = await getCharactersRequest();

        this.characters = characters;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCharacterById(id: string) {
      this.isLoading = true;

      try {
        const character = await getCharacterByIdRequest(id);

        this.selectedCharacter = character;

        return character;
      } finally {
        this.isLoading = false;
      }
    },

    async createCharacter(payload: CreateCharacterPayload) {
      this.isLoading = true;

      try {
        const character = await createCharacterRequest(payload);

        this.characters.unshift(character);

        return character;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
