import {
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

class AbilitiesDto {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export class CreateCharacterDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsMongoId()
  raceId: string;

  @IsOptional()
  @IsString()
  subraceSlug?: string;

  @IsMongoId()
  classId: string;

  @IsMongoId()
  backgroundId: string;

  @IsObject()
  abilities: AbilitiesDto;

  @IsOptional()
  @IsString()
  alignment?: string;

  @IsOptional()
  @IsString()
  appearance?: string;

  @IsOptional()
  @IsString()
  personalityTraits?: string;

  @IsOptional()
  @IsString()
  ideals?: string;

  @IsOptional()
  @IsString()
  bonds?: string;

  @IsOptional()
  @IsString()
  flaws?: string;

  @IsOptional()
  @IsString()
  backstory?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
