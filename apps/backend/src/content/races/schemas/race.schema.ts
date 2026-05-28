import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RaceDocument = HydratedDocument<Race>;

@Schema({ _id: false })
class RaceAbilityBonuses {
  @Prop()
  strength?: number;

  @Prop()
  dexterity?: number;

  @Prop()
  constitution?: number;

  @Prop()
  intelligence?: number;

  @Prop()
  wisdom?: number;

  @Prop()
  charisma?: number;
}

@Schema({ _id: false })
class Subrace {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: RaceAbilityBonuses, default: {} })
  abilityBonuses: RaceAbilityBonuses;

  @Prop({ type: [String], default: [] })
  traits: string[];

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop({ default: null })
  imageUrl?: string;
}

@Schema({
  timestamps: true,
})
export class Race {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  slug: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  size: string;

  @Prop({
    required: true,
  })
  speed: number;

  @Prop({
    type: RaceAbilityBonuses,
    default: {},
  })
  abilityBonuses: RaceAbilityBonuses;

  @Prop({
    type: [String],
    default: [],
  })
  languages: string[];

  @Prop({
    type: [String],
    default: [],
  })
  traits: string[];

  @Prop({
    type: [Subrace],
    default: [],
  })
  subraces: Subrace[];

  @Prop({
    default: null,
  })
  imageUrl?: string;

  @Prop({
    default: 'Subraza',
  })
  selectionLabel: string;
}

export const RaceSchema = SchemaFactory.createForClass(Race);
