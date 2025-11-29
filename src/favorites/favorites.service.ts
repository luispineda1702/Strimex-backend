import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite, MediaType } from 'src/domain/entities/favorite.entity';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favRepo: Repository<Favorite>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly mediaService: MediaService,
  ) {}

  async addFavorite(
    userId: string,
    mediaId: number,
    mediaType: 'movie' | 'tv',
  ) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const fav = this.favRepo.create({
      mediaId,
      mediaType: mediaType === 'movie' ? MediaType.MOVIE : MediaType.TV,
      user,
    });

    return this.favRepo.save(fav);
  }

  async removeFavorite(
    userId: string,
    mediaId: number,
    mediaType: 'movie' | 'tv',
  ) {
    return this.favRepo.delete({
      mediaId,
      mediaType: mediaType === 'movie' ? MediaType.MOVIE : MediaType.TV,
      user: { id: userId },
    });
  }

  async getUserFavorites(userId: string) {
    const favorites = await this.favRepo.find({
      where: { user: { id: userId } },
    });

    const fullData = await Promise.all(
      favorites.map((fav) =>
        this.mediaService.getDetails(fav.mediaType, fav.mediaId),
      ),
    );

    return fullData;
  }
}
