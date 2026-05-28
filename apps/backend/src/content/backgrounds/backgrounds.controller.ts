import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { BackgroundsService } from './backgrounds.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';

@Controller('content/backgrounds')
export class BackgroundsController {
  constructor(private readonly backgroundsService: BackgroundsService) {}

  @Get()
  findAll() {
    return this.backgroundsService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.backgroundsService.findBySlug(slug);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  seedBackgrounds() {
    return this.backgroundsService.seedBackgrounds();
  }
}
