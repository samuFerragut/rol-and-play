import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CharacterClass, CharacterClassSchema } from './schemas/class.schema';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CharacterClass.name,
        schema: CharacterClassSchema,
      },
    ]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
