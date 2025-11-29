// src/application/use-cases/register-user.usecase.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository';
import type { UserRepository } from 'src/domain/repositories/user.repository';
import { User } from 'src/domain/entities/user.entity';

interface RegisterUserInput {
  firebaseUid: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const existing = await this.userRepo.findByFirebaseUid(input.firebaseUid);
    if (existing) {
      return existing;
    }

    const existingByEmail = await this.userRepo.findByEmail(input.email);
    if (existingByEmail) {
      throw new ConflictException('Email ya está registrado con otro usuario');
    }

    return this.userRepo.create(input);
  }
}
