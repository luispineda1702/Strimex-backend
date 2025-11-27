import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([User]), FirebaseModule],
})
export class AuthModule {}
