import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Background, BackgroundDocument } from './schemas/background.schema';
import { backgroundsSeed } from '../../database/seeds/backgrounds.seed';

@Injectable()
export class BackgroundsService {
  constructor(
    @InjectModel(Background.name)
    private readonly backgroundModel: Model<BackgroundDocument>,
  ) {}

  async findAll() {
    return this.backgroundModel.find().sort({ name: 1 });
  }

  async findBySlug(slug: string) {
    return this.backgroundModel.findOne({ slug });
  }

  async seedBackgrounds() {
    await this.backgroundModel.deleteMany({});
    return this.backgroundModel.insertMany(backgroundsSeed);
  }
}
