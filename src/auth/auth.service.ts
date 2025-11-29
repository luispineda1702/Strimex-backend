// src/auth/auth.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RegisterUserUseCase } from 'src/aplication/use-cases/register-user.usecase';
import { GetCurrentUserUseCase } from 'src/aplication/use-cases/get-current-user.usecase';
import { UpdateUserProfileUseCase } from 'src/aplication/use-cases/update-user.profile.usecase';

import { USER_REPOSITORY } from 'src/domain/repositories/user.repository';
import type { UserRepository } from 'src/domain/repositories/user.repository';

import { FirebaseAdminService } from 'src/firebase/firebase-admin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    private readonly jwtService: JwtService,
    private readonly firebaseAuth: FirebaseAdminService,
  ) {}

  registerFromFirebase(payload: {
    firebaseUid: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
    return this.registerUserUseCase.execute(payload);
  }

  getCurrentUser(firebaseUid: string) {
    return this.getCurrentUserUseCase.execute(firebaseUid);
  }

  async updateProfile(
    firebaseUid: string,
    data: { name?: string; avatarUrl?: string },
  ) {
    return this.updateUserProfileUseCase.execute({
      firebaseUid,
      ...data,
    });
  }

  async loginWithFirebase(firebaseToken: string) {
    const firebaseUser = await this.firebaseAuth.verifyIdToken(firebaseToken);

    if (!firebaseUser.email) {
      throw new NotFoundException('El usuario de Firebase no tiene email');
    }

    let user = await this.userRepository.findByFirebaseUid(firebaseUser.uid);

    if (!user) {
      user = await this.userRepository.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.email.split('@')[0],
      });
    }

    const token = this.jwtService.sign({ uid: user.id });

    return {
      token,
      email: user.email,
      fullname: user.name,
      avatar: user.avatar,
      userId: user.id,
    };
  }
}
