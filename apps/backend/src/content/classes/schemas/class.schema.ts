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

  @Prop({ type: [ClassFeature], default: [] })
  featuresByLevel: ClassFeature[];

  @Prop({ default: null })
  spellcastingAbility?: string;

  @Prop({ default: false })
  isSpellcaster: boolean;

  @Prop({ default: null })
  imageUrl?: string;
}

export const CharacterClassSchema =
  SchemaFactory.createForClass(CharacterClass);
