import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { Character, CharacterSchema } from './schemas/character.schema';

import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Character.name,
        schema: CharacterSchema,
      },
    ]),
  ],

  controllers: [CharactersController],

  providers: [CharactersService],

  exports: [CharactersService],
})
export class CharactersModule {}
