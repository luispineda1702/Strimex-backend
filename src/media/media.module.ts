// src/media/media.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [HttpModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
