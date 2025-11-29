// src/home/home.module.ts
import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
