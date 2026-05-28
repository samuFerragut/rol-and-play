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
  skillProficiencies?: string[];
  skillChoices?: string[];
  numberOfSkillChoices?: number;
  imageUrl?: string | null;
}

export interface Race {
  _id: string;
  name: string;
  slug: string;
  selectionLabel?: string;
  description: string;
  size: string;
  speed: number;
  abilityBonuses: AbilityBonuses;
  languages: string[];
  skillProficiencies?: string[];
  skillChoices?: string[];
  numberOfSkillChoices?: number;
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
  startingEquipmentChoices?: {
    label: string;
    options: string[];
  }[];
  featuresByLevel: {
    level: number;
    name: string;
    description: string;
  }[];
  subclassSelectionLabel: string;
  subclassLevel: number;
  subclasses: {
    name: string;
    slug: string;
    description: string;
    featuresByLevel: {
      level: number;
      name: string;
      description: string;
    }[];
    imageUrl?: string | null;
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
