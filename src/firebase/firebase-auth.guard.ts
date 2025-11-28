// src/auth/firebase-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = String(authHeader).startsWith('Bearer ')
      ? String(authHeader).split(' ')[1]
      : String(authHeader);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decoded = await this.firebaseService.verifyIdToken(token);
      // attach firebase user info to request for downstream controllers/services
      req.firebaseUser = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
