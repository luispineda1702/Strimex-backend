// src/aplication/use-cases/update-user-profile.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository';
import type { UserRepository } from 'src/domain/repositories/user.repository';
import { User } from 'src/domain/entities/user.entity';

interface UpdateUserProfileInput {
  firebaseUid: string;
  name?: string;
  avatarUrl?: string;
}

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: UpdateUserProfileInput): Promise<User> {
    const existing = await this.userRepo.findByFirebaseUid(input.firebaseUid);
    if (!existing) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.userRepo.updateProfile(input.firebaseUid, {
      name: input.name,
      avatarUrl: input.avatarUrl,
    });
  }
}
