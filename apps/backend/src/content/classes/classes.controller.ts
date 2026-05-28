import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';

@Controller('content/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.classesService.findBySlug(slug);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  seedClasses() {
    return this.classesService.seedClasses();
  }
}
