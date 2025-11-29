// src/app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { FavoritesModule } from './favorites/favorites.module';
import { HomeModule } from './home/home.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    DatabaseModule,
    FirebaseModule,
    AuthModule,
    FavoritesModule,
    HomeModule,
    MediaModule,
  ],
})
export class AppModule {}
