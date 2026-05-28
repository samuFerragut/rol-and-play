import { Module } from '@nestjs/common';

import { RacesModule } from './races/races.module';
import { ClassesModule } from './classes/classes.module';
import { BackgroundsModule } from './backgrounds/backgrounds.module';

@Module({
  imports: [RacesModule, ClassesModule, BackgroundsModule],
})
export class ContentModule {}
