// src/firebase/firebase-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository';
import { Inject } from '@nestjs/common';
import type { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseAdmin: FirebaseAdminService,

    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const decoded = await this.firebaseAdmin.verifyIdToken(token);

      const user = await this.userRepo.findByFirebaseUid(decoded.uid);

      request.user = {
        firebaseUid: decoded.uid,
        email: decoded.email,
        dbId: user?.id ?? null,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
