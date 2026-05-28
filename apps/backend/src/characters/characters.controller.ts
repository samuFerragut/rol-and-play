import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../common/decorators/current-user.decorator';

import { CharactersService } from './characters.service';

import { CreateCharacterDto } from './dto/create-character.dto';

@UseGuards(JwtAuthGuard)
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body()
    createCharacterDto: CreateCharacterDto,
  ) {
    return this.charactersService.create(user.id, createCharacterDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.charactersService.findAllByOwner(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.charactersService.findOneById(user.id, id);
  }
}
