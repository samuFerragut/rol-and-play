import { Controller, Get, Param, Post } from '@nestjs/common';

import { RacesService } from './races.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';

@Controller('content/races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Get()
  findAll() {
    return this.racesService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.racesService.findBySlug(slug);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  seedRaces() {
    return this.racesService.seedRaces();
  }
}
