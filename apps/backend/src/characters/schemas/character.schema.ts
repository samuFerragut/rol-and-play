import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

export type CharacterDocument = HydratedDocument<Character>;

@Schema({
  _id: false,
})
class CharacterAbilities {
  @Prop({
    required: true,
    default: 10,
  })
  strength: number;

  @Prop({
    required: true,
    default: 10,
  })
  dexterity: number;

  @Prop({
    required: true,
    default: 10,
  })
  constitution: number;

  @Prop({
    required: true,
    default: 10,
  })
  intelligence: number;

  @Prop({
    required: true,
    default: 10,
  })
  wisdom: number;

  @Prop({
    required: true,
    default: 10,
  })
  charisma: number;
}

@Schema({
  timestamps: true,
})
export class Character {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  ownerId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Race',
    required: true,
  })
  raceId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'CharacterClass',
    required: true,
  })
  classId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Background',
    required: true,
  })
  backgroundId: Types.ObjectId;

  @Prop({
    default: 1,
  })
  level: number;

  @Prop({
    default: 0,
  })
  experience: number;

  @Prop({
    type: CharacterAbilities,
    required: true,
  })
  abilities: CharacterAbilities;

  @Prop({
    default: '',
  })
  alignment: string;

  @Prop({
    default: '',
  })
  appearance: string;

  @Prop({
    default: '',
  })
  personalityTraits: string;

  @Prop({
    default: '',
  })
  ideals: string;

  @Prop({
    default: '',
  })
  bonds: string;

  @Prop({
    default: '',
  })
  flaws: string;

  @Prop({
    default: '',
  })
  backstory: string;

  @Prop({
    default: '',
  })
  notes: string;

  @Prop({
    default: null,
  })
  avatarUrl?: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
