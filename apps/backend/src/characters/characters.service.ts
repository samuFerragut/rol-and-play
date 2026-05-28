import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Character, CharacterDocument } from './schemas/character.schema';

import { Model, Types } from 'mongoose';

import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<CharacterDocument>,
  ) {}

  async create(ownerId: string, createCharacterDto: CreateCharacterDto) {
    return this.characterModel.create({
      ...createCharacterDto,
      ownerId: new Types.ObjectId(ownerId),
    });
  }

  async findAllByOwner(ownerId: string) {
    return this.characterModel
      .find({
        ownerId,
      })
      .populate('raceId')
      .populate('classId')
      .populate('backgroundId')
      .sort({
        createdAt: -1,
      });
  }

  async findOneById(ownerId: string, characterId: string) {
    const character = await this.characterModel
      .findOne({
        _id: characterId,
        ownerId,
      })
      .populate('raceId')
      .populate('classId')
      .populate('backgroundId');

    if (!character) {
      throw new NotFoundException('Personaje no encontrado.');
    }

    return character;
  }
}
