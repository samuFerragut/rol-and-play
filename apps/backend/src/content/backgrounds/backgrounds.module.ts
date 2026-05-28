import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Background, BackgroundSchema } from './schemas/background.schema';
import { BackgroundsController } from './backgrounds.controller';
import { BackgroundsService } from './backgrounds.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Background.name,
        schema: BackgroundSchema,
      },
    ]),
  ],
  controllers: [BackgroundsController],
  providers: [BackgroundsService],
  exports: [BackgroundsService],
})
export class BackgroundsModule {}
