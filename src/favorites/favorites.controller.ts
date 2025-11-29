// src/favorites/favorites.controller.ts
import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

@Controller('favorites')
@UseGuards(FirebaseAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  addFavorite(
    @Req() req,
    @Body() body: { mediaId: number; mediaType: 'movie' | 'tv' },
  ) {
    return this.favoritesService.addFavorite(
      req.user.dbId,
      body.mediaId,
      body.mediaType,
    );
  }

  @Delete()
  removeFavorite(
    @Req() req,
    @Body() body: { mediaId: number; mediaType: 'movie' | 'tv' },
  ) {
    return this.favoritesService.removeFavorite(
      req.user.dbId,
      body.mediaId,
      body.mediaType,
    );
  }

  @Get()
  getFavorites(@Req() req) {
    return this.favoritesService.getUserFavorites(req.user.dbId);
  }
}
