import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Race, RaceDocument } from './schemas/race.schema';
import { racesSeed } from '../../database/seeds/races.seed';

@Injectable()
export class RacesService {
  constructor(
    @InjectModel(Race.name)
    private readonly raceModel: Model<RaceDocument>,
  ) {}

  async findAll() {
    return this.raceModel.find().sort({
      name: 1,
    });
  }

  async findBySlug(slug: string) {
    return this.raceModel.findOne({
      slug,
    });
  }

  async seedRaces() {
    await this.raceModel.deleteMany({});

    return this.raceModel.insertMany(racesSeed);
  }
}
