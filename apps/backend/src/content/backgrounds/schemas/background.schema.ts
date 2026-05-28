import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BackgroundDocument = HydratedDocument<Background>;

@Schema({ _id: false })
class BackgroundFeature {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

@Schema({ _id: false })
class BackgroundProficiencies {
  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  tools: string[];

  @Prop({ type: [String], default: [] })
  languages: string[];
}

@Schema({ timestamps: true, collection: 'backgrounds' })
export class Background {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: BackgroundProficiencies, required: true })
  proficiencies: BackgroundProficiencies;

  @Prop({ type: [String], default: [] })
  equipment: string[];

  @Prop({ type: BackgroundFeature, required: true })
  feature: BackgroundFeature;

  @Prop({ type: [String], default: [] })
  suggestedCharacteristics: string[];

  @Prop({ default: null })
  imageUrl?: string;
}

export const BackgroundSchema = SchemaFactory.createForClass(Background);
