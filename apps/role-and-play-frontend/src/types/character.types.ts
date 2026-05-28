import type { Background, CharacterClass, Race } from "./content.types";

export interface CharacterAbilities {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CreateCharacterPayload {
  name: string;
  raceId: string;
  classId: string;
  backgroundId: string;
  abilities: CharacterAbilities;
  alignment?: string;
  appearance?: string;
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  backstory?: string;
  notes?: string;
  avatarUrl?: string;
}

export interface Character {
  _id: string;
  name: string;
  raceId: Race;
  classId: CharacterClass;
  backgroundId: Background;
  level: number;
  experience: number;
  abilities: CharacterAbilities;
  alignment?: string;
  appearance?: string;
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  backstory?: string;
  notes?: string;
  avatarUrl?: string | null;
}
