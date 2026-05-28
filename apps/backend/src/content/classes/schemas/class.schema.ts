import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CharacterClassDocument = HydratedDocument<CharacterClass>;

@Schema({ _id: false })
class ClassFeature {
  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

@Schema({ _id: false })
class ClassSubclass {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [ClassFeature], default: [] })
  featuresByLevel: ClassFeature[];

  @Prop({ default: null })
  imageUrl?: string;
}

@Schema({ _id: false })
class ClassProficiencies {
  @Prop({ type: [String], default: [] })
  armor: string[];

  @Prop({ type: [String], default: [] })
  weapons: string[];

  @Prop({ type: [String], default: [] })
  tools: string[];

  @Prop({ type: [String], default: [] })
  savingThrows: string[];

  @Prop({ type: [String], default: [] })
  skillChoices: string[];

  @Prop({ default: 0 })
  numberOfSkillChoices: number;
}

@Schema({ _id: false })
class StartingEquipmentChoice {
  @Prop({ required: true })
  label: string;

  @Prop({ type: [String], default: [] })
  options: string[];
}

@Schema({ timestamps: true, collection: 'classes' })
export class CharacterClass {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  hitDice: string;

  @Prop({ type: [String], default: [] })
  primaryAbilities: string[];

  @Prop({ type: ClassProficiencies, required: true })
  proficiencies: ClassProficiencies;

  @Prop({ type: [String], default: [] })
  startingEquipment: string[];

  @Prop({ type: [StartingEquipmentChoice], default: [] })
  startingEquipmentChoices: StartingEquipmentChoice[];

  @Prop({ type: [ClassFeature], default: [] })
  featuresByLevel: ClassFeature[];

  @Prop({ default: 'Subclase' })
  subclassSelectionLabel: string;

  @Prop({ default: 3 })
  subclassLevel: number;

  @Prop({ type: [ClassSubclass], default: [] })
  subclasses: ClassSubclass[];

  @Prop({ default: null })
  spellcastingAbility?: string;

  @Prop({ default: false })
  isSpellcaster: boolean;

  @Prop({ default: null })
  imageUrl?: string;
}

export const CharacterClassSchema =
  SchemaFactory.createForClass(CharacterClass);
