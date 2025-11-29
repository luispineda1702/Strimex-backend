// src/media/media.controller.ts
import { Controller, Get, Query, Param } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('popular')
  getPopular(@Query('type') type: string) {
    return this.mediaService.getPopular(type);
  }

  @Get('top')
  getTop(@Query('type') type: string) {
    return this.mediaService.getTopRated(type);
  }

  @Get('search')
  search(@Query('type') type: string, @Query('q') q: string) {
    return this.mediaService.search(type, q);
  }

  @Get(':id')
  getDetails(@Param('id') id: string, @Query('type') type: string) {
    return this.mediaService.getDetails(type, Number(id));
  }

  @Get(':id/providers')
  getProviders(@Param('id') id: string, @Query('type') type: string) {
    return this.mediaService.getProviders(type, Number(id));
  }

  @Get(':id/recommended')
  getRecommended(@Param('id') id: string, @Query('type') type: string) {
    return this.mediaService.getRecommended(type, Number(id));
  }

  @Get('genre/:id')
  getByGenre(@Param('id') id: string, @Query('type') type: string) {
    return this.mediaService.getByGenre(type, Number(id));
  }

  @Get('trending')
  getTrending() {
    return this.mediaService.getTrending();
  }
}
