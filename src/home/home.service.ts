// src/home/home.service.ts
import { Injectable } from '@nestjs/common';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class HomeService {
  constructor(private readonly mediaService: MediaService) {}

  async getHome() {
    const [popularMovies, popularSeries, topMovies, topSeries, trending] =
      await Promise.all([
        this.mediaService.getPopular('movie'),
        this.mediaService.getPopular('tv'),
        this.mediaService.getTopRated('movie'),
        this.mediaService.getTopRated('tv'),
        this.mediaService.getTrending(),
      ]);

    return {
      popularMovies,
      popularSeries,
      topMovies,
      topSeries,
      trending,
    };
  }
}
