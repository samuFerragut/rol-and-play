import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CharacterClass, CharacterClassDocument } from './schemas/class.schema';
import { classesSeed } from '../../database/seeds/classes.seed';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(CharacterClass.name)
    private readonly classModel: Model<CharacterClassDocument>,
  ) {}

  async findAll() {
    return this.classModel.find().sort({ name: 1 });
  }

  async findBySlug(slug: string) {
    return this.classModel.findOne({ slug });
  }

  async seedClasses() {
    await this.classModel.deleteMany({});
    return this.classModel.insertMany(classesSeed);
  }
}
