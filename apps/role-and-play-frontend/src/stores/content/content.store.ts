import { defineStore } from "pinia";

import {
  getBackgroundsRequest,
  getClassesRequest,
  getRacesRequest,
} from "../../api/content.api";

import type {
  Background,
  CharacterClass,
  Race,
} from "../../types/content.types";

interface ContentState {
  races: Race[];
  classes: CharacterClass[];
  backgrounds: Background[];

  isLoading: boolean;

  isLoaded: boolean;
}

export const useContentStore = defineStore(
  "content",

  {
    state: (): ContentState => ({
      races: [],
      classes: [],
      backgrounds: [],

      isLoading: false,

      isLoaded: false,
    }),

    actions: {
      async fetchContent() {
        if (this.isLoaded) {
          return;
        }

        this.isLoading = true;

        try {
          const [races, classes, backgrounds] = await Promise.all([
            getRacesRequest(),
            getClassesRequest(),
            getBackgroundsRequest(),
          ]);

          this.races = races;
          this.classes = classes;
          this.backgrounds = backgrounds;

          this.isLoaded = true;
        } finally {
          this.isLoading = false;
        }
      },
    },
  },
);
