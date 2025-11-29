// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from 'src/domain/entities/user.entity';
import { USER_REPOSITORY } from '../domain/repositories/user.repository';
import { TypeOrmUserRepository } from '../infrastructure/repositories/user.typeorm.repository';

import { RegisterUserUseCase } from 'src/aplication/use-cases/register-user.usecase';
import { GetCurrentUserUseCase } from 'src/aplication/use-cases/get-current-user.usecase';
import { UpdateUserProfileUseCase } from 'src/aplication/use-cases/update-user.profile.usecase';

import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    FirebaseModule,
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'STRIMEX_SUPER_SECRET',
      signOptions: { expiresIn: '7d' },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,

    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },

    RegisterUserUseCase,
    GetCurrentUserUseCase,
    UpdateUserProfileUseCase,
  ],

  exports: [USER_REPOSITORY, AuthService],
})
export class AuthModule {}
