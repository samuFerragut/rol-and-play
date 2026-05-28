import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { BackgroundsService } from '../content/backgrounds/backgrounds.service';
import { ClassesService } from '../content/classes/classes.service';
import { RacesService } from '../content/races/races.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const racesService = app.get(RacesService);
    const classesService = app.get(ClassesService);
    const backgroundsService = app.get(BackgroundsService);

    const [races, classes, backgrounds] = await Promise.all([
      racesService.seedRaces(),
      classesService.seedClasses(),
      backgroundsService.seedBackgrounds(),
    ]);

    console.log('Seed completed');
    console.log(`- Races: ${races.length}`);
    console.log(`- Classes: ${classes.length}`);
    console.log(`- Backgrounds: ${backgrounds.length}`);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('Seed failed');
  console.error(error);
  process.exit(1);
});
