export interface AbilityBonuses {
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
}

export interface Subrace {
  name: string;
  slug: string;
  description: string;
  abilityBonuses: AbilityBonuses;
  traits: string[];
  languages: string[];
  imageUrl?: string | null;
}

export interface Race {
  _id: string;
  name: string;
  slug: string;
  description: string;
  size: string;
  speed: number;
  abilityBonuses: AbilityBonuses;
  languages: string[];
  traits: string[];
  imageUrl?: string | null;
  subraces: Subrace[];
}

export interface CharacterClass {
  _id: string;
  name: string;
  slug: string;
  description: string;
  hitDice: string;
  primaryAbilities: string[];
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    savingThrows: string[];
    skillChoices: string[];
    numberOfSkillChoices: number;
  };
  startingEquipment: string[];
  featuresByLevel: {
    level: number;
    name: string;
    description: string;
  }[];
  spellcastingAbility?: string | null;
  isSpellcaster: boolean;
  imageUrl?: string | null;
}

export interface Background {
  _id: string;
  name: string;
  slug: string;
  description: string;
  proficiencies: {
    skills: string[];
    tools: string[];
    languages: string[];
  };
  equipment: string[];
  feature: {
    name: string;
    description: string;
  };
  suggestedCharacteristics: string[];
  imageUrl?: string | null;
}
